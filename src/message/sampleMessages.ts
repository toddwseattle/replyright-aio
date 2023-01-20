export interface sampleMessageTests {
  emailType: string;
  body: string;
  expectedPrompt: string;
}

export const sampleMessageBodies: sampleMessageTests[] = [
  {
    emailType: "noprompt",
    expectedPrompt: "",
    body: `
 
From: Lexie Bogenreif <lexie.bogenreif@envorso.com> 
Sent: Friday, January 20, 2023 8:18 AM
To: Todd Warren <todd@envorso.com>; Jeremiah Seraphine <Jeremiah@envorso.com>
Cc: Jeff Henshaw <jeff.henshaw@envorso.com>; Scott Tobin <scott.tobin@envorso.com>; Adrian Balfour <Adrian@envorso.com>
Subject: TPM SOW - For review prior to submission
    
Hi Todd, Jeremiah: 
    
Please find the edited TPM SOW attached. 
    
We would appreciate your review/feedback prior to submitting it into the Ford system. 
    
Thanks!
Lexie 
    
    
Lexie Bogenreif
Senior Consultant | lexie.bogenreif@envorso.com| <mailto:lexie.bogenreif@envorso.com|>  (515) 491-1299
    
From: Adrian Balfour <Adrian@envorso.com <mailto:Adrian@envorso.com> > 
Sent: Thursday, January 19, 2023 1:43 PM
To: Lexie Bogenreif <lexie.bogenreif@envorso.com <mailto:lexie.bogenreif@envorso.com> >; Scott Tobin <scott.tobin@envorso.com <mailto:scott.tobin@envorso.com> >
Subject: FW: TPM SOW edits
    
We need to change the TPM work order and resubmit as described by J. 
    
From: Jeremiah Seraphine <Jeremiah@envorso.com <mailto:Jeremiah@envorso.com> > 
Sent: Wednesday, January 18, 2023 4:38 PM
To: Adrian Balfour <Adrian@envorso.com <mailto:Adrian@envorso.com> >
Cc: Todd Warren <todd@envorso.com <mailto:todd@envorso.com> >
Subject: TPM SOW edits
    
Adrian,
    
I spoke to Todd this afternoon about the TPM SOW for Ford. He agrees that rather than defining the TPM R&Rs and then imposing that role on Ford we should identify the flavors of TPMs that are working now. 
    
The project might instead look like this:
Phase 1 – Q1 2023
1.	Identify and assemble a working group of top performing TPMs at Ford (Flavia, Nathan Webster, Cameron Rogers (Product Manager actually), someone from Zoltan’s team)
2.	Identify and document working models that work at Ford (assuming more than one)
3.	Gather benchmarking data on TPMs at top performing companies
4.	Make executive recommendations including JD, R&Rs, recommended ratios
5.	Exec decision from Roz, Doug, etc
    
Phase 2 – Q2 2023
6.	Then build TPM career ladders (quarter)
7.	Assessment rubric, interview script and plan (assessment kit)
8.	Plan to scale new TPM across org
    "
`,
  },
];
