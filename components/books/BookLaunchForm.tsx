"use client";

import { useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Mail,
  Phone,
  User,
  Users,
} from "lucide-react";

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  organization: "",
  attendanceType: "in-person",
  numberOfGuests: "1",
  specialRequirements: "",
  consent: false,
};

export default function BookLaunchForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = event.target;
    const { name } = target;

    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    }

    if (!formData.lastName.trim()) {
      nextErrors.lastName = "Last name is required.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phoneNumber.trim()) {
      nextErrors.phoneNumber = "Phone number is required.";
    }

    if (!formData.consent) {
      nextErrors.consent =
        "Please confirm that the registration information is correct.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Replace this temporary delay with your API request later.
      await new Promise((resolve) => setTimeout(resolve, 900));

      setIsSubmitted(true);
      setFormData(initialFormData);
    } catch {
      setErrors({
        general: "Registration failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-[2rem] border border-orange-100 bg-white p-8 text-center shadow-[0_25px_70px_-35px_rgba(194,65,12,0.45)] sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <h2 className="mt-6 text-2xl font-black text-slate-900 sm:text-3xl">
          Registration Received
        </h2>

        <p className="mx-auto mt-4 max-w-md leading-7 text-slate-600">
          Thank you for registering. Event confirmation and launch details
          will be sent to your email when they are finalized.
        </p>

        <button
          type="button"
          onClick={() => setIsSubmitted(false)}
          className="mt-7 rounded-full bg-orange-600 px-6 py-3 font-bold text-white transition hover:-translate-y-1 hover:bg-orange-700"
        >
          Register Another Guest
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-orange-100 bg-white p-5 shadow-[0_25px_70px_-35px_rgba(194,65,12,0.45)] sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="First Name"
          error={errors.firstName}
        >
          <User className={iconClass} />

          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First name"
            autoComplete="given-name"
            className={inputClass}
          />
        </FormField>

        <FormField
          label="Last Name"
          error={errors.lastName}
        >
          <User className={iconClass} />

          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last name"
            autoComplete="family-name"
            className={inputClass}
          />
        </FormField>

        <FormField
          label="Email Address"
          error={errors.email}
        >
          <Mail className={iconClass} />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            className={inputClass}
          />
        </FormField>

        <FormField
          label="Phone Number"
          error={errors.phoneNumber}
        >
          <Phone className={iconClass} />

          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="+251 911 123 456"
            autoComplete="tel"
            className={inputClass}
          />
        </FormField>

        <div className="sm:col-span-2">
          <FormField label="Organization or Institution">
            <Building2 className={iconClass} />

            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="Organization, church, university, or ministry"
              className={inputClass}
            />
          </FormField>
        </div>

        <FormField label="Attendance Type">
          <select
            name="attendanceType"
            value={formData.attendanceType}
            onChange={handleChange}
            className={selectClass}
          >
            <option value="in-person">In person</option>
            <option value="online">Online, if available</option>
          </select>
        </FormField>

        <FormField label="Number of Guests">
          <Users className={iconClass} />

          <select
            name="numberOfGuests"
            value={formData.numberOfGuests}
            onChange={handleChange}
            className={selectClass}
          >
            <option value="1">1 guest</option>
            <option value="2">2 guests</option>
            <option value="3">3 guests</option>
            <option value="4">4 guests</option>
          </select>
        </FormField>

        <div className="sm:col-span-2">
          <label
            htmlFor="specialRequirements"
            className={labelClass}
          >
            Special Requirements
          </label>

          <textarea
            id="specialRequirements"
            name="specialRequirements"
            value={formData.specialRequirements}
            onChange={handleChange}
            placeholder="Accessibility needs, dietary requirements, or other notes"
            rows={4}
            className="w-full resize-none rounded-2xl border border-orange-100 bg-[#fffaf5] px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
          />
        </div>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          name="consent"
          checked={formData.consent}
          onChange={handleChange}
          className="mt-1 h-4 w-4 accent-orange-600"
        />

        <span className="text-sm leading-6 text-slate-600">
          I confirm that the information provided is correct and agree to
          receive updates related to the EvaSUE book launch ceremony.
        </span>
      </label>

      {errors.consent && (
        <p className="mt-2 text-sm text-red-600">
          {errors.consent}
        </p>
      )}

      {errors.general && (
        <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {errors.general}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-7 py-4 font-bold text-white shadow-lg shadow-orange-600/20 transition hover:-translate-y-1 hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {isSubmitting
          ? "Submitting Registration..."
          : "Reserve My Place"}

        {!isSubmitting && (
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        )}
      </button>
    </form>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}
      </label>

      <div className="relative">
        {children}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

const labelClass =
  "mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-700";

const iconClass =
  "pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-500";

const inputClass =
  "w-full rounded-2xl border border-orange-100 bg-[#fffaf5] py-3 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10";

const selectClass =
  "w-full appearance-none rounded-2xl border border-orange-100 bg-[#fffaf5] py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10";