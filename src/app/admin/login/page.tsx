"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <form
        className="w-full max-w-sm border border-border bg-bg-white p-8"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setError("");
          try {
            const res = await fetch("/api/admin/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: email.trim().toLowerCase(),
                password,
              }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Алдаа");
            router.push("/admin");
          } catch (err) {
            setError(err instanceof Error ? err.message : "Алдаа");
          } finally {
            setLoading(false);
          }
        }}
      >
        <h1 className="font-serif text-3xl">Админ нэвтрэх</h1>
        <div className="mt-6 space-y-4">
          <Field label="Нэвтрэх нэр">
            <Input
              type="text"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Field label="Нууц үг">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>
          {error ? <p className="text-sm">{error}</p> : null}
          <Button type="submit" fullWidth loading={loading}>
            Нэвтрэх
          </Button>
        </div>
      </form>
    </div>
  );
}
