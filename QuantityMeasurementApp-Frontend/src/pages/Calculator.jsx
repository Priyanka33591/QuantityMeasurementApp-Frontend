import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  MEASUREMENT_TYPES,
  OPERATIONS,
  UNITS_BY_TYPE,
} from "../constants/units";
import { useAuth } from "../context/useAuth.js";
import * as api from "../api/client";
import "./Page.css";
import "./Calculator.css";

/** Backend compare returns unit as "true" / "false" string. */
function isCompareResponse(res) {
  if (!res) return false;
  const u = String(res.unit).toLowerCase();
  return u === "true" || u === "false";
}

export default function Calculator() {
  const { isAuthenticated } = useAuth();

  const [measurementType, setMeasurementType] = useState("LengthUnit");
  const [operationType, setOperationType] = useState("ADD");
  const [v1, setV1] = useState("1");
  const [u1, setU1] = useState("FEET");
  const [v2, setV2] = useState("1");
  const [u2, setU2] = useState("FEET");
  const [resultUnit, setResultUnit] = useState("");

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const units = UNITS_BY_TYPE[measurementType] || [];

  const opMeta = useMemo(
    () => OPERATIONS.find((o) => o.value === operationType),
    [operationType],
  );
  const needsTwo = opMeta?.needsTwo !== false;

  const multiplyDivideUnitMismatch = useMemo(
    () => operationType === "MULTIPLY" && u1 !== u2,
    [operationType, u1, u2],
  );

  function syncUnitsForType(nextType) {
    const list = UNITS_BY_TYPE[nextType] || [];
    setU1((u) => (list.includes(u) ? u : list[0]));
    setU2((u) => (list.includes(u) ? u : list[0]));
    setResultUnit("");
  }

  function handleMeasurementChange(next) {
    setMeasurementType(next);
    syncUnitsForType(next);
    setError("");
    setResult(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    const input1 = { value: Number(v1), unit: u1 };
    const input2 =
      needsTwo && operationType !== "CONVERT"
        ? { value: Number(v2), unit: u2 }
        : null;

    const meta = {
      measurementType,
      operationType,
      resultUnit:
        operationType === "CONVERT"
          ? resultUnit || null
          : operationType === "MULTIPLY" || operationType === "DIVIDE"
            ? null
            : resultUnit.trim() || null,
    };

    if (
      operationType === "CONVERT" &&
      (!meta.resultUnit || meta.resultUnit === "")
    ) {
      setError("For convert, choose a target unit.");
      setLoading(false);
      return;
    }

    if (operationType === "MULTIPLY") {
      if (u1 !== u2) {
        setError("Units must be the same for multiplication.");
        setLoading(false);
        return;
      }
    }

    // 🔥 divide by zero check
    if (operationType === "DIVIDE" && Number(v2) === 0) {
      setError("Cannot divide by zero");
      setLoading(false);
      return;
    }

    if (!v1 || (needsTwo && !v2)) {
      setError("Please enter valid values");
      setLoading(false);
      return;
    }

    const body = {
      input1,
      input2,
      meta,
    };

    try {
      const res = await api.performOperation(body);
      setResult(res);
    } catch (err) {
      let msg = err.message || "Operation failed";

      // 🔥 backend JSON error handle
      try {
        const parsed = JSON.parse(err.message);
        if (parsed.error) msg = parsed.error;
      } catch (e) {
        // ignore if not JSON
      }

      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-shell calc">
      <form className="calc-layout" onSubmit={handleSubmit}>
        <div className="calc-main card">
          <section className="calc-section" aria-labelledby="meas-label">
            <h2 id="meas-label" className="calc-section-title">
              Category
            </h2>
            <div
              className="calc-seg"
              role="group"
              aria-label="Measurement type"
            >
              {MEASUREMENT_TYPES.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  className={`calc-seg-btn ${measurementType === m.value ? "is-active" : ""}`}
                  onClick={() => handleMeasurementChange(m.value)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </section>

          <section className="calc-section" aria-labelledby="op-label">
            <h2 id="op-label" className="calc-section-title">
              Operation
            </h2>
            <div
              className="calc-chips"
              role="group"
              aria-label="Operation type"
            >
              {OPERATIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  className={`calc-chip ${operationType === o.value ? "is-active" : ""}`}
                  onClick={() => {
                    setOperationType(o.value);
                    setError("");
                    setResult(null);
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </section>

          <section className="calc-section">
            <h2 className="calc-section-title">Values</h2>
            <div className="calc-values">
              <div className="calc-field">
                <label htmlFor="v1">First value</label>
                <input
                  id="v1"
                  type="number"
                  step="any"
                  value={v1}
                  onChange={(e) => {
                    setV1(e.target.value);
                    setError("");
                    setResult(null);
                  }}
                />
              </div>
              <div className="calc-field">
                <label htmlFor="u1">Unit</label>
                <select
                  id="u1"
                  value={u1}
                  onChange={(e) => {
                    setU1(e.target.value);
                    setError("");
                    setResult(null);
                  }}
                >
                  {units.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {needsTwo && operationType !== "CONVERT" ? (
              <div className="calc-values calc-values--pair">
                <div className="calc-field">
                  <label htmlFor="v2">Second value</label>
                  <input
                    id="v2"
                    type="number"
                    step="any"
                    value={v2}
                    onChange={(e) => {
                      setV2(e.target.value);
                      setError("");
                      setResult(null);
                    }}
                  />
                </div>
                <div className="calc-field">
                  <label htmlFor="u2">Unit</label>
                  <select
                    id="u2"
                    value={u2}
                    onChange={(e) => {
                      setU2(e.target.value);
                      setError("");
                      setResult(null);
                    }}
                  >
                    {units.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : null}

            {multiplyDivideUnitMismatch ? (
              <p className="calc-unit-warning" role="status">
                Units must be the same for multiplication.
              </p>
            ) : null}

            {operationType !== "COMPARE" &&
            operationType !== "MULTIPLY" &&
            operationType !== "DIVIDE" ? (
              <div className="calc-field calc-field--full">
                <label htmlFor="ru">
                  {operationType === "CONVERT"
                    ? "Convert to"
                    : "Result unit (optional)"}
                </label>
                <select
                  id="ru"
                  value={resultUnit}
                  onChange={(e) => {
                    setResultUnit(e.target.value);
                    setError("");
                  }}
                >
                  <option value="">
                    {operationType === "CONVERT"
                      ? "Select target unit…"
                      : "Default (first unit)"}
                  </option>
                  {units.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </section>

          {error && <p className="form-error calc-error">❌ {error}</p>}

          <div className="calc-actions">
            <button
              className="btn-primary calc-run"
              type="submit"
              disabled={loading}
            >
              {loading ? "Computing…" : "Run operation"}
            </button>
          </div>
        </div>

        <aside className="calc-side" aria-live="polite">
          <div className={`calc-result card ${result ? "has-value" : ""}`}>
            <p className="calc-result-label">
              {result && isCompareResponse(result) ? "Comparison" : "Result"}
            </p>
            {result ? (
              isCompareResponse(result) ? (
                <>
                  <div
                    className={`calc-result-bool ${
                      String(result.unit).toLowerCase() === "true"
                        ? "is-true"
                        : "is-false"
                    }`}
                  >
                    {String(result.unit).toLowerCase() === "true"
                      ? "true"
                      : "false"}
                  </div>
                  <p className="calc-result-hint">
                    true = equal after normalizing units, false = not equal.
                  </p>
                </>
              ) : (
                <>
                  <div className="calc-result-main">
                    <span className="calc-result-num">{result.value}</span>
                    <span className="calc-result-unit">{result.unit}</span>
                  </div>
                  <p className="calc-result-hint">
                    Rounded to two decimals on the server.
                  </p>
                </>
              )
            ) : (
              <p className="calc-result-empty">
                Run an operation to see the output here.
              </p>
            )}
          </div>

          <div className="calc-tip card">
            <p className="calc-tip-title">Tips</p>
            <ul>
              <li>
                <strong>Multiply </strong> — same unit on both sides.
              </li>
              <li>
                <strong>History</strong> —{" "}
                {isAuthenticated ? (
                  <Link to="/history">Open your log</Link>
                ) : (
                  <>
                    <Link to="/login">Sign in</Link> to enable.
                  </>
                )}
              </li>
            </ul>
          </div>
        </aside>
      </form>
    </div>
  );
}
