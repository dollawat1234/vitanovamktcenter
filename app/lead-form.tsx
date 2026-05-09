"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData))
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setStatus("error");
      setMessage(result.message ?? "Something went wrong.");
      return;
    }

    form.reset();
    setStatus("success");
    setMessage(result.message ?? "Thanks, we will be in touch soon.");
  }

  return (
    <form className="leadForm" onSubmit={submitLead}>
      <label>
        Name
        <input name="name" minLength={2} required />
      </label>
      <label>
        Email
        <input name="email" type="email" required />
      </label>
      <label>
        Company
        <input name="company" />
      </label>
      <label>
        Message
        <textarea name="message" rows={4} required />
      </label>
      <button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send inquiry"}
      </button>
      {message ? <p className={`formMessage ${status}`}>{message}</p> : null}
    </form>
  );
}
