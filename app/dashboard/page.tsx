"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Settings, Share2, Copy, Trash2, FolderOpen, TreeDeciduous } from "lucide-react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";

const createTreeSchema = z.object({
  familyName: z.string().min(2, "Family name is required"),
  motto: z.string().optional(),
  origin: z.string().optional(),
  isPublic: z.boolean().default(false),
});

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const { data: trees, isLoading: isTreesLoading } = useQuery({
    queryKey: ["trees"],
    queryFn: async () => {
      const res = await fetch("/api/trees");
      if (!res.ok) throw new Error("Failed to fetch trees");
      return res.json();
    },
    enabled: status === "authenticated",
  });

  const createTreeMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createTreeSchema>) => {
      const res = await fetch("/api/trees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create tree");
      return res.json();
    },
    onSuccess: (newTree) => {
      queryClient.invalidateQueries({ queryKey: ["trees"] });
      toast.success("Tree created successfully!");
      setIsCreateOpen(false);
      router.push(`/tree/${newTree.id}`);
    },
    onError: () => toast.error("Failed to create tree"),
  });

  const deleteTreeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/trees/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete tree");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trees"] });
      toast.success("Tree deleted");
    },
    onError: () => toast.error("Failed to delete tree"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(createTreeSchema),
    defaultValues: { familyName: "", motto: "", origin: "", isPublic: false }
  });

  if (status === "loading" || isTreesLoading) {
    return (
      <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Family Trees</h1>
          <p className="text-muted-foreground mt-1">Manage and explore your created lineages.</p>
        </div>
        
        <Dialog.Root open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <Dialog.Trigger asChild>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Plus className="w-5 h-5" />
              Create New Tree
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border p-6 rounded-2xl shadow-xl z-50">
              <Dialog.Title className="text-xl font-bold mb-4">Create Family Tree</Dialog.Title>
              <form onSubmit={handleSubmit((d) => createTreeMutation.mutate(d))} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Family Name</label>
                  <input
                    {...register("familyName")}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                    placeholder="e.g. The Smith Family"
                  />
                  {errors.familyName && <p className="text-red-500 text-xs mt-1">{errors.familyName.message as string}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Family Motto (Optional)</label>
                  <input
                    {...register("motto")}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                    placeholder="e.g. Always Forward"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Origin (Optional)</label>
                  <input
                    {...register("origin")}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                    placeholder="e.g. London, UK"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="isPublic" {...register("isPublic")} className="rounded border-border" />
                  <label htmlFor="isPublic" className="text-sm">Make this tree public (anyone with link can view)</label>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <Dialog.Close asChild>
                    <button type="button" className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg">Cancel</button>
                  </Dialog.Close>
                  <button 
                    type="submit" 
                    disabled={createTreeMutation.isPending}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
                  >
                    {createTreeMutation.isPending ? "Creating..." : "Create Tree"}
                  </button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {trees?.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center mt-20 p-10 bg-card border border-border rounded-[2rem] shadow-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg-secondary)]/50 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <TreeDeciduous className="w-20 h-20 text-[var(--color-accent)] mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl font-bold font-heading mb-3">Welcome to Vanshavali</h2>
            <p className="text-[var(--color-text-secondary)] mb-10 text-lg leading-relaxed max-w-lg mx-auto">
              Start documenting your heritage today. You can explore our demo family tree to see how it works, or start building your own from scratch.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={async () => {
                  try {
                    toast.loading("Generating demo tree...", { id: "demo" });
                    const res = await fetch("/api/trees/demo", { method: "POST" });
                    if (!res.ok) throw new Error();
                    const tree = await res.json();
                    queryClient.invalidateQueries({ queryKey: ["trees"] });
                    toast.success("Demo tree loaded!", { id: "demo" });
                    router.push(`/tree/${tree.id}`);
                  } catch (e) {
                    toast.error("Failed to load demo tree", { id: "demo" });
                  }
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[var(--color-bg-secondary)] border border-border font-medium hover:bg-[var(--color-border)] transition-colors flex items-center justify-center gap-2"
              >
                <FolderOpen className="w-5 h-5" />
                Explore Demo Family
              </button>
              <button 
                onClick={() => setIsCreateOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[var(--color-accent)] text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-[var(--color-accent)]/20"
              >
                <Plus className="w-5 h-5" />
                Create My Family
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {trees?.map((tree: any, i: number) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={tree.id}
              className={cn(
                "bg-[var(--color-card)] border border-[var(--color-border)] rounded-[1.5rem] overflow-hidden hover:shadow-xl transition-all duration-300 group relative",
                i % 2 === 1 ? "lg:mt-8" : "",
                i % 3 === 2 ? "lg:mt-16" : ""
              )}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-[var(--color-bg-secondary)] text-[var(--color-accent)] rounded-2xl flex items-center justify-center">
                    <TreeDeciduous className="w-7 h-7" />
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/tree/${tree.id}`);
                        toast.success("Link copied to clipboard");
                      }}
                      className="p-2.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded-xl transition-colors"
                      title="Share link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this tree?")) {
                          deleteTreeMutation.mutate(tree.id);
                        }
                      }}
                      className="p-2.5 text-red-500/70 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-colors"
                      title="Delete tree"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold font-heading mb-2 leading-tight text-[var(--color-text)]">
                  {tree.familyName}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-6 line-clamp-1 italic font-heading">
                  {tree.motto || "No motto set"} • {tree.origin || "Unknown origin"}
                </p>
                
                <div className="flex items-center gap-4 text-xs font-medium text-[var(--color-text-secondary)] mb-8 bg-[var(--color-bg-secondary)] w-fit px-3 py-1.5 rounded-full">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
                    {tree._count?.members || 0} Members
                  </div>
                  <div className="w-px h-3 bg-[var(--color-border)]" />
                  <div className="flex items-center gap-1.5">
                    {tree.isPublic ? "Public" : "Private"}
                  </div>
                </div>

                <Link 
                  href={`/tree/${tree.id}`}
                  className="w-full flex items-center justify-center py-3.5 bg-[var(--color-bg)] hover:bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl font-medium transition-colors gap-2 group-hover:border-[var(--color-accent-secondary)]"
                >
                  Open Tree
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
