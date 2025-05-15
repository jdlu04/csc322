"use client";
import { React, useState } from "react";
import CorrectionTextBox from "../../components/CorrectionTextBox";
import CorrectionCheckbox from "../../components/CorrectionCheckbox";
import Statisics from "../../components/Statisics";
export default function page() {
  const [texts, setText] = useState("");
  const [llmCheck, setLLMCheck] = useState(false);

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
        body: JSON.stringify({ text: texts }),
      });
  
      if (!response.ok) {
        const errorText = await response.text(); 
        console.error("Server error response:", errorText);
        alert("Something went wrong. See console for details.");
        return;
      }
  
      const result = await response.json();
  
      setText(result.corrected);
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
      <CorrectionTextBox value={texts}
  onTextChange={(text) => setText(text)}/>
      <button className="h-10 w-25 bg-black" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
