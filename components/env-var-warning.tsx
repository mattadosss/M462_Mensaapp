import Link from "next/link";

export function EnvVarWarning() {
  return (
    <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-alert-triangle"
      >
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
      <span>
        Missing environment variables.{" "}
        <Link
          href="https://app.supabase.com/project/_/settings/api"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          Get your API keys
        </Link>
      </span>
    </div>
  );
} 