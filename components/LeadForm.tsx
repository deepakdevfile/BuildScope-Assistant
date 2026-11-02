import { Selection } from "@/lib/types";
import { buildBrief } from "@/lib/estimator";
import { useState } from "react";

type Field = "name" | "email" | "phone" | "company" | "message";
type Errors = Partial<Record<Field | "services", string>>;

interface Props {
  selection: Selection;
  source: "wizard" | "chat";
  transcript?: {
    role: "user" | "assistant";
    content: string;
  }[];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s-]{7,20}$/;

export default function LeadForm({
  selection,
  source,
  transcript = [],
}: Props) {
  const [values, setValues] = useState<Record<Field, string>>({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [banner, setBanner] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ id: string; brief: string } | null>(null);

  const set =
    (k: Field) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [k]: e.target.value }));

  function validate(): Errors {
    const e: Errors = {};
    if (values.name.trim().length < 2) {
      e.name = "Please enter your full name.";
    }
    if (!EMAIL_RE.test(values.email.trim())) {
      e.email = "Please enter a valid email address.";
    }
    if (values.phone.trim() && !PHONE_RE.test(values.phone.trim())) {
      e.phone = "Please enter a valid phone number.";
    }
    if (selection.services.length === 0) {
      e.services = "Select at least one service.";
    }
    return e;
  }

  async function onSubmit(ev: React.SubmitEvent) {
    ev.preventDefault();

    const e = validate();
    setErrors(e);
    setBanner("");

    if (Object.keys(e).length) {
      return;
    }

    setSending(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website,
          selection,
          source,
          transcript,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        id?: string;
        error?: string;
        fields?: Errors;
      };

      if (res.status === 201 && data.id) {
        setDone({ id: data.id, brief: buildBrief(selection, values) });
      } else if (res.status === 400 && data.fields) {
        setErrors(data.fields);
      } else {
        setBanner(
          data.error ??
            "Something went wrong. Please email opportunities@cynbit.in.",
        );
      }
    } catch {
      setBanner(
        "Network error. Your ansers are still here, so please try again.",
      );
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div>
        <h2>Brief received. Thank you!</h2>
        <p>
          Reference <span>{done.id}</span>. Our team will reach out within 24
          hours.
        </p>
        <pre>{done.brief}</pre>
        <button
          type="button"
          onClick={() =>
            navigator.clipboard?.writeText(done.brief).catch(() => {})
          }
        >
          Copy brief
        </button>
      </div>
    );
  }

  const input = (
    k: Field,
    label: string,
    opts: {
      type?: string;
      optional?: boolean;
      max: number;
      ac?: string;
      area?: boolean;
    },
  ) => {
    const err = errors[k];
    const common = {
      id: `f-${k}`,
      name: k,
      value: values[k],
      onChange: set(k),
      maxLength: opts.max,
      autoComplete: opts.ac,
      "aria-invalid": err ? true : undefined,
      "aria-describedby": err ? `e-${k}` : undefined,
    };

    return (
      <div>
        <label htmlFor={`f-${k}`}>
          {label}
          {opts.optional && <span> (optional)</span>}
        </label>
        {opts.area ? (
          <textarea {...common} />
        ) : (
          <input type={opts.type ?? "text"} {...common} />
        )}
        <p id={`e-${k}`}>{err ?? ""}</p>
      </div>
    );
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <h2>Where should we send your brief?</h2>
      <p>We reply within 24 hours with a tailored plan.</p>
      {banner && <div role="alert">{banner}</div>}
      {errors.services && <div role="alert">{errors.services}</div>}
      <div>
        {input("name", "Full name", { max: 80, ac: "name" })}
        {input("email", "Email address", {
          type: "email",
          max: 120,
          ac: "email",
        })}
      </div>

      <div>
        {input("company", "Company", {
          max: 100,
          ac: "organization",
          optional: true,
        })}
        {input("phone", "Phone", {
          type: "tel",
          max: 20,
          ac: "tel",
          optional: true,
        })}
      </div>

      {input("message", "Anything else we should know?", {
        max: 2000,
        optional: true,
        area: true,
      })}

      <div>
        <label htmlFor="f-website">Website</label>
        <input
          id="f-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <button type="submit" disabled={sending}>
        {sending ? "Sending..." : "Send brief"}
      </button>
    </form>
  );
}
