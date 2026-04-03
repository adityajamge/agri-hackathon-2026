import { type FormEvent, useState } from "react";
import { cropOptions, issueOptions } from "../data/mockData";
import type { RiskLevel } from "../types/app";

export function ReportPage() {
  const [crop, setCrop] = useState(cropOptions[0].name);
  const [issue, setIssue] = useState(issueOptions[0]);
  const [severity, setSeverity] = useState<RiskLevel>("medium");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="page page-enter stack-lg">
      <section className="card stack-md">
        <div className="card-heading">
          <h3>Report local outbreak</h3>
          <p>Share field signal with nearby farmers</p>
        </div>

        <form onSubmit={handleSubmit} className="report-form">
          <label className="field-group">
            <span>Crop</span>
            <select value={crop} onChange={(event) => setCrop(event.target.value)}>
              {cropOptions.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field-group">
            <span>Issue detected</span>
            <select value={issue} onChange={(event) => setIssue(event.target.value)}>
              {issueOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <fieldset className="severity-group">
            <legend>Severity</legend>
            <div className="segmented-control">
              {(["low", "medium", "high"] as RiskLevel[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSeverity(level)}
                  className={`segment${severity === level ? " is-selected" : ""}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="field-group">
            <span>Notes</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Describe symptoms, spread speed, and any treatment tried"
              rows={4}
            />
          </label>

          <button type="submit" className="btn btn--primary btn--block">
            Publish Community Alert
          </button>
        </form>

        {submitted && (
          <p className="toast-success">
            Alert submitted. Nearby farmers will see this in community feed.
          </p>
        )}
      </section>
    </div>
  );
}
