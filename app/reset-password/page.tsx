"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type RecoveryState = "loading" | "ready" | "invalid" | "complete";

function recoveryErrorMessage() {
  return "恢复链接无效、已使用或已过期。请重新发送恢复邮件，并只打开最新邮件中的链接一次。";
}

export default function ResetPasswordPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [state, setState] = useState<RecoveryState>("loading");
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("正在验证恢复链接…");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    const prepareRecoverySession = async () => {
      if (!supabase) {
        if (active) {
          setState("invalid");
          setMessage("认证服务暂时不可用，请稍后再试。");
        }
        return;
      }

      const queryParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const isRecovery = hashParams.get("type") === "recovery";

      if (queryParams.get("error") || queryParams.get("error_code")) {
        if (active) {
          setState("invalid");
          setMessage(recoveryErrorMessage());
        }
        return;
      }

      if (!isRecovery || !accessToken || !refreshToken) {
        if (active) {
          setState("invalid");
          setMessage(recoveryErrorMessage());
        }
        return;
      }

      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });

      if (!active) return;

      if (error || !data.user) {
        setState("invalid");
        setMessage(recoveryErrorMessage());
        return;
      }

      window.history.replaceState(null, "", "/reset-password");
      setEmail(data.user.email || null);
      setState("ready");
      setMessage("恢复链接已验证。请设置新密码。");
    };

    void prepareRecoverySession();

    return () => {
      active = false;
    };
  }, [supabase]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase || state !== "ready") return;

    if (password.length < 10) {
      setMessage("新密码至少需要 10 个字符。");
      return;
    }

    if (password !== confirmation) {
      setMessage("两次输入的密码不一致。");
      return;
    }

    setSubmitting(true);
    setMessage("正在更新密码…");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setSubmitting(false);
      setMessage("密码更新失败，请确认恢复链接仍然有效后重试。");
      return;
    }

    await supabase.auth.signOut({ scope: "local" });
    setPassword("");
    setConfirmation("");
    setSubmitting(false);
    setState("complete");
    setMessage("密码已经更新。恢复会话已安全退出。");
  };

  return (
    <main className="h-dvh overflow-y-auto bg-[#050306] px-5 py-10 text-white">
      <section className="mx-auto flex min-h-[calc(100dvh-80px)] w-full max-w-md flex-col justify-center gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-200">Jimmy Yao</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">设置新密码</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            此页面只用于完成 Supabase 账户的密码恢复。
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-5 shadow-2xl shadow-cyan-950/30">
          <p
            aria-live="polite"
            className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-200"
          >
            {message}
          </p>

          {state === "ready" ? (
            <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
              {email ? <p className="text-sm text-slate-300">账户：{email}</p> : null}

              <label className="grid gap-2 text-sm font-bold text-slate-200" htmlFor="password">
                新密码
                <input
                  id="password"
                  type="password"
                  required
                  minLength={10}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="min-h-[52px] rounded-xl border border-white/15 bg-black/40 px-4 text-base text-white outline-none ring-cyan-300/40 transition focus:ring-4"
                />
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-200" htmlFor="confirmation">
                再次输入新密码
                <input
                  id="confirmation"
                  type="password"
                  required
                  minLength={10}
                  autoComplete="new-password"
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                  className="min-h-[52px] rounded-xl border border-white/15 bg-black/40 px-4 text-base text-white outline-none ring-cyan-300/40 transition focus:ring-4"
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="min-h-[52px] rounded-xl border border-cyan-300/70 bg-cyan-300 px-4 text-sm font-black text-slate-950 transition disabled:cursor-wait disabled:opacity-60 active:scale-[0.98]"
              >
                {submitting ? "更新中…" : "更新密码"}
              </button>
            </form>
          ) : null}

          {state === "invalid" ? (
            <p className="mt-4 text-sm leading-6 text-slate-300">
              请返回 Supabase 用户管理页重新发送恢复邮件，然后只点击最新邮件一次。
            </p>
          ) : null}

          {state === "complete" ? (
            <Link
              href="/login"
              className="mt-5 flex min-h-[52px] items-center justify-center rounded-xl border border-cyan-300/70 bg-cyan-300 px-4 text-sm font-black text-slate-950"
            >
              返回登录页
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  );
}
