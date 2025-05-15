"use client";

import { React, useState, useEffect } from "react";
import CorrectionTextBox from "../../components/CorrectionTextBox";
import CorrectionCheckbox from "../../components/CorrectionCheckbox";
import Statisics from "../../components/Statisics";
export default function page() {
  const [correctedText, setCorrectedText] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [llmCheck, setLLMCheck] = useState(false);

  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokens = async () => {
      const access_token = localStorage.getItem("token");
      if (!access_token) {
        setError("Not logged in");
        return;
      }
      try {
        const response = await fetch("http://127.0.0.1:5000/api/tokens", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        });
        const result = await response.json();

        if (response.ok) {
          setBalance(result.tokens);
        } else {
          alert(result.error);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchTokens();
  }, []);

  const handleSubmit = () => {
    if (llmCheck) {
      console.log(llmCheck);
      llmCorrection();
    } else {
      //self correction
    }
  };

  const llmCorrection = async () => {
    console.log("llm function");
    try {
      const response = await fetch("http://127.0.0.1:5000/llm-correct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: correctedText }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        alert("Something went wrong. See console for details.");
        return;
      }

      const result = await response.json();

      setCorrectedText(result.corrected);
      setOriginalText(result.original);

      console.log("Original:", result.original);
      console.log("Corrected:", result.corrected);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-screen h-screen bg-greyBG">
      <h1 className="text-black"> Text-it Fix-it</h1>
      <p className="text-black">
        {" "}
        Text-it Fix-it is an LLM-based text checker. Begin by selecting one of
        the two correction options: LLM-correction or self-correction. Then,
        upload a text file or type the text you wanted to be corrected and click
        submit to start the correction process.{" "}
      </p>
      <Statisics />
      <CorrectionCheckbox
        onLLMChange={(isLLMSelected) => {
          console.log("Is LLM selected?", isLLMSelected);
          setLLMCheck(isLLMSelected);
        }}
      />
      <div className="justify-between inline-flex h-screen w-screen">
        <div className="w-1/3 h-1/2">
          <div className="h-screen w-screen pb-10 text-textGrey">
            <div className="h-10 w-1/3 border-l border-r border-t rounded-t-lg bg-white justify-between inline-flex">
              <p>Textbox</p>
              <p>Available Tokens:{balance}</p>
            </div>
            <div className="w-1/3 h-1/2 border rounded-b-lg bg-white">
              <textarea
                className="resize-none w-full h-11/12"
                value={correctedText}
                onChange={(e) => setCorrectedText(e.target.value)}
              />
              <div className="w-1/2 inline-flex">
                <button className="text-textGrey">blacklist</button>
                <p> | </p>
                <button className="text-textGrey">upload text</button>
              </div>
            </div>
            <button className="h-10 w-25 bg-black my-5" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
        <div className="w-2/3">
          <div className="ml-14 h-screen w-10/12 px-2 pb-8 text-textGrey">
            <div className="h-10 w-full border-l border-r border-t rounded-t-lg bg-white justify-between inline-flex">
              <p>Textbox</p>
            </div>
            <div className="w-full h-1/2 border rounded-b-lg bg-white">
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
