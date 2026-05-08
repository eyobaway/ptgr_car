"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Phone, 
  MapPin, 
  Languages, 
  BookOpen, 
  CheckCircle2, 
  Loader2,
  ShieldCheck,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/CustomSelect";
import { Switch } from "@/components/ui/switch";

const agentSchema = z.object({
  role: z.string().min(2, "Role is required"),
  phone: z.string().min(5, "Phone number is required"),
  location: z.string().min(2, "Location is required"),
  bio: z.string().optional(),
  languages: z.string().optional(),
  isActive: z.boolean().default(true),
});

type AgentFormValues = z.infer<typeof agentSchema>;

interface AgentFormProps {
  initialData?: any;
  onSubmit: (data: AgentFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function AgentForm({ initialData, onSubmit, isLoading }: AgentFormProps) {
  const router = useRouter();
  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentSchema),
    defaultValues: initialData || {
      role: "Real Estate Agent",
      phone: "",
      location: "",
      bio: "",
      languages: "English",
      isActive: true,
    },
  });

  const sectionClass = "bg-white p-8 md:p-10 rounded-4xl premium-shadow border border-slate-100 mb-8";
  const labelClass = "text-sm font-bold text-slate-700 mb-2 block";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
        <AnimatePresence mode="wait">
          {/* Section 1: Professional Identity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={sectionClass}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-primary">Professional Identity</h2>
              </div>
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                    <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400 mt-0.5">Active Status</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Professional Role</FormLabel>
                    <FormControl>
                      <CustomSelect
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select professional role"
                        options={[
                          { value: "Real Estate Agent", label: "Real Estate Agent" },
                          { value: "Senior Broker", label: "Senior Broker" },
                          { value: "Property Manager", label: "Property Manager" },
                          { value: "Leasing Specialist", label: "Leasing Specialist" },
                          { value: "Commercial Expert", label: "Commercial Expert" },
                        ]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="languages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}><Languages className="w-4 h-4 inline mr-2" /> Languages Spoken</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. English, Spanish, French" 
                        className="px-5 py-6 rounded-xl border-slate-200 focus:ring-primary/20" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Separate multiple languages with commas</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </motion.div>

          {/* Section 2: Contact & Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={sectionClass}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Globe className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-primary">Contact & Location</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}><Phone className="w-4 h-4 inline mr-2" /> Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="+1 234 567 890" 
                        className="px-5 py-6 rounded-xl border-slate-200 focus:ring-primary/20" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}><MapPin className="w-4 h-4 inline mr-2" /> Primary Location</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Manhattan, New York" 
                        className="px-5 py-6 rounded-xl border-slate-200 focus:ring-primary/20" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </motion.div>

          {/* Section 3: Biography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={sectionClass}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-primary">Expertise & Biography</h2>
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>Professional Bio</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-[180px] w-full rounded-2xl border border-slate-200 bg-transparent px-5 py-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none leading-relaxed"
                      placeholder="Share your experience, achievements, and unique approach to real estate..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        </AnimatePresence>

        {/* Final Actions */}
        <div className="flex flex-col md:flex-row justify-end gap-4 pb-12">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="py-6 px-10 rounded-2xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50 transition-all hover:scale-105"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="py-6 px-12 rounded-2xl font-black text-base transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 flex items-center gap-3"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
            {initialData ? "Update Professional Profile" : "Create Agent Profile"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
