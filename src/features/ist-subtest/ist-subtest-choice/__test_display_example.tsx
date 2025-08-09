"use client";

import React, { useState } from "react";
import { InteractiveExample } from "./interactive-example";

const testExamples = [
  {
    type: "example-question",
    subtestType: "1",
    question: {
      id: "demo-horse-subtest-1",
      text: "Seekor kuda mempunyai kesamaan terbanyak dengan seekor...",
      options: [
        { id: "A", text: "kucing" },
        { id: "B", text: "bajing" },
        { id: "C", text: "keledai" },
        { id: "D", text: "lembu" },
        { id: "E", text: "anjing" },
      ],
    },
    correctAnswer: "C",
    explanation: "Kuda dan keledai keduanya termasuk dalam famili Equidae.",
  },
  {
    type: "example-question",
    subtestType: "4",
    question: {
      id: "demo-text-subtest-4",
      text: "Tuliskan lawan kata dari 'harapan':",
    },
    exampleAnswer: "putus asa",
    explanation: "Putus asa merupakan lawan dari harapan.",
  },
  {
    type: "example-question",
    subtestType: "5",
    question: {
      id: "demo-number-subtest-5",
      text: "Pilih angka yang sesuai dengan pola: 2, 4, 6, 8, ...?",
    },
    instruction: "Pada tes nyata, pilih dari matriks angka yang disediakan.",
  },
];

export default function TestExamples() {
  const [activeExample, setActiveExample] = useState<number | null>(null);

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Test Interactive Examples</h2>

      <div className="space-y-4">
        {testExamples.map((example, index) => (
          <div key={index} className="rounded-lg border p-4">
            <h3 className="mb-2 text-lg font-semibold">
              Subtest {example.subtestType} Example
            </h3>
            <button
              onClick={() => setActiveExample(index)}
              className="rounded bg-blue-500 px-3 py-1 text-sm text-white"
            >
              Show Example
            </button>

            {activeExample === index && (
              <div className="mt-4">
                <InteractiveExample data={example} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
