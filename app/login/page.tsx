import Link from "next/link";
import { safeNextUrl } from "@/lib/auth-next";

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : {};
  const next = safeNextUrl(firstParam(params.next));
  const error = firstParam(params.error);
  const sent = firstParam(params.sent) === "1";

  return (
    <main className="min-h-dvh bg-[#050306] px-5 py-10 text-white">
      <section className="mx-auto flex min-h-[calc(100dvh-80px)] w-full max-w-md flex-col justify-center gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-200">Jimmy Yao</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">统一登录入口</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            使用同一个 Supabase Auth 账号进入 AI Learning World、学习系统和论坛。
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-5 shadow-2xl shadow-cyan-950/30">
          <Link
            className="flex min-h-[54px] items-center justify-center rounded-xl border border-cyan-300/70 bg-cyan-300 px-4 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition active:scale-[0.98]"
            href={`/login/google?next=${encodeURIComponent(next)}`}
          >
            Google でログイン / 使用 Google 登录
          </Link>

          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-slate-400">
            <span className="h-px flex-1 bg-white/10" />
            <span>or</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <form action="/login/magic" method="post" className="grid gap-3">
            <input type="hidden" name="next" value={next} />
            <label htmlFor="email" className="text-sm font-bold text-slate-200">
              Magic Link 邮箱登录
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="min-h-[52px] rounded-xl border border-white/15 bg-black/40 px-4 text-base text-white outline-none ring-cyan-300/40 transition placeholder:text-slate-500 focus:ring-4"
            />
            <button
              className="min-h-[52px] rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-black text-white transition hover:bg-white/15 active:scale-[0.98]"
              type="submit"
            >
              登录链接を送信 / 发送登录邮件
            </button>
          </form>

          {sent ? (
            <p className="mt-4 rounded-lg border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 text-sm text-emerald-100">
              登录邮件已发送，请打开邮箱继续。
            </p>
          ) : null}

          {error ? (
            <p className="mt-4 rounded-lg border border-red-300/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
              登录暂时无法完成，请稍后再试。
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
