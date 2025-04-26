import React from 'react'

export default function CorrectionTextBox() {
  return (
    <div className='h-1/2 w-3/4 bg-white text-textGrey border rounded-lg'>
        <div className='h-10 w-full border-b'>
            Textbox
            {/*Available tokens */}
        </div>
        <div className='w-full h-full'>
            <textarea className=' resize-none size-full'></textarea>
            {/*Blacklist words, upload text, and save text */}
        </div>
    </div>
  )
}
