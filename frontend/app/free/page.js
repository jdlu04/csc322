import React from "react";
import CorrectionTextBox from "../../components/CorrectionTextBox";
import CorrectionCheckbox from "../../components/CorrectionCheckbox";
export default function page() {
  // add the stats endpoints onto the FREE user 
  /*useEffect(() => {

  })*/

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
      <CorrectionCheckbox />
      <CorrectionTextBox />
      <button className="h-10 w-25 bg-black">Submit</button>
    </div>
  );
}