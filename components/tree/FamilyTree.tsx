"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
  BackgroundVariant,
  Node,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { familyData } from "@/data/family";
import { FamilyMember } from "@/types/family";
import FamilyNode from "./FamilyNode";
import ProfileDrawer from "./ProfileDrawer";

const NODE_WIDTH = 160;
const NODE_HEIGHT = 180;
const H_GAP = 60;
const V_GAP = 100;

// Layout: compute x/y for each member based on generation
function buildLayout(members: FamilyMember[]): { nodes: Node[]; edges: Edge[] } {
  // Group by generation
  const byGen = members.reduce<Record<number, FamilyMember[]>>((acc, m) => {
    if (!acc[m.generation]) acc[m.generation] = [];
    acc[m.generation].push(m);
    return acc;
  }, {});

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  Object.entries(byGen).forEach(([genStr, genMembers]) => {
    const gen = Number(genStr);
    const totalWidth = genMembers.length * (NODE_WIDTH + H_GAP) - H_GAP;
    const startX = -totalWidth / 2;

    genMembers.forEach((member, i) => {
      const x = startX + i * (NODE_WIDTH + H_GAP);
      const y = (gen - 1) * (NODE_HEIGHT + V_GAP);

      nodes.push({
        id: member.id,
        type: "familyNode",
        position: { x, y },
        data: {
          member,
          isYou: member.id === "gen6-you",
        },
        draggable: true,
      });
    });
  });

  // Build edges from parent-child relationships
  members.forEach((member) => {
    member.childrenIds.forEach((childId) => {
      edges.push({
        id: `${member.id}-${childId}`,
        source: member.id,
        target: childId,
        type: "smoothstep",
        animated: false,
        style: {
          stroke: "var(--color-accent-secondary)",
          strokeWidth: 1.5,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "var(--color-accent-secondary)",
          width: 12,
          height: 12,
        },
      });
    });

    // Spouse connection (dashed)
    if (member.spouseId && member.id < member.spouseId) {
      edges.push({
        id: `spouse-${member.id}-${member.spouseId}`,
        source: member.id,
        target: member.spouseId,
        type: "straight",
        style: {
          stroke: "var(--color-highlight)",
          strokeWidth: 1,
          strokeDasharray: "4 3",
          opacity: 0.6,
        },
      });
    }
  });

  return { nodes, edges };
}

const nodeTypes = { familyNode: FamilyNode };

interface FamilyTreeProps {
  treeId?: string;
  initialMembers?: FamilyMember[];
  compact?: boolean;
  disableControls?: boolean;
}

export default function FamilyTree({ treeId, initialMembers, compact = false, disableControls = false }: FamilyTreeProps) {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildLayout(initialMembers || familyData.members),
    [initialMembers]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialNodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        onSelect: (member: FamilyMember) => setSelectedMember(member),
      },
    }))
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync state when initialMembers change (e.g. from React Query)
  useEffect(() => {
    setNodes(
      initialNodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          onSelect: (member: FamilyMember) => setSelectedMember(member),
        },
      }))
    );
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      const member = (node.data as { member: FamilyMember }).member;
      if (member) {
        setSelectedMember(member);
      }
    },
    []
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: compact ? 0.4 : 0.05 }}
        minZoom={0.02}
        maxZoom={3.5}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        className="rounded-xl"
        style={{ background: "var(--color-bg)" }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="rgba(109,76,65,0.12)"
        />
        {!disableControls && (
          <>
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                const member = (node.data as { member: FamilyMember }).member;
                const colors: Record<number, string> = {
                  1: "#6D4C41",
                  2: "#795548",
                  3: "#A1887F",
                  4: "#C8A97E",
                  5: "#3C7A57",
                  6: "#427A8C",
                };
                return colors[member?.generation || 1] || "#6D4C41";
              }}
              maskColor="rgba(250,248,245,0.7)"
              style={{ borderRadius: 12 }}
            />
          </>
        )}
      </ReactFlow>

      <ProfileDrawer
        member={selectedMember}
        allMembers={initialMembers || familyData.members}
        onClose={() => setSelectedMember(null)}
        onSelectMember={(m) => setSelectedMember(m)}
      />
    </div>
  );
}
