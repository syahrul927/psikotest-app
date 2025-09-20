## Description Task

In this app there are several types of test, I want you to improve the feature of IST Test. IST test have 9 subtests, as an Admin I want to capable reset the subtest. So the participant can retry if there's an issue stopper. You can check @src/features/ist-invitation/ist-invitation-table/columns.tsx there's column action that show options. I want to add logic if the status is AWAITING_REVIEW it will show option Reset. when click this button it will show the dialog. Inside this dialog will show list of subtest with started and finish timestamp. and on the right of each subtest there's a button to reset subtest so it will. keep the styles default and use the existing component in ui as possible.

For now I want you to focus only for UI implementation. you can just provide empty function for the button if needed and write the todo. For showing dialog triggered by button inside the dropdown is little bit tricky, you can check my implementation for references.

Always ask me if you need to clarify something!
