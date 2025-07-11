1. these are variable of summary, each variable have meaning themself.

2. rawScore is calculated from table result detail, sum of the correct answer.
   the standarizedScore from the table standard score. it will select matched age, calculate birth of date of testerprofile with NOW() (timestamp when calculated)
   I'm not sure about the summary. they are summary each tester after calculated, either the ist or kraepelin

3. for the successful test completion is they have summary in, that's the end state.
   it will trigger after the 6 subtest of ist done.
   did you mean for table invitation? it's for Kraepelin Invitation. Before I develop feature test IST, I didn't expect will develop another type of test.

4. only one user and it's for admin. they can create invitation, review, and see the result.
5. yes, Invitation was for Kraepelin and like I said in no 3.
   KraeplinResult is the endstate of Kraepelin test is calculated

I will explain a little bit about the flow process each test

Invitation (which is for invitation Kraepelin)

- Created Invitation
- filled Tester Profile
- will insert KraepelinResult, but with required only field
- when user doing the test it will insert into KraepelinResultDetail
- after that, when admin see the result. it will fill the KraepelinResultSummary
- then will completed the empty field on table KraepelinResult

ISTInvitation (for Ist Test)

- Created Ist invitation
- created IST Subtest Session
- filled ist tester profile
- when user doing the test it will insert into IstResultDetail
- when user done doing test it will update invitation to AWAITING_REVIEW
- when admin review the test. it will insert the IstResult
- after review it will calculate and insert to IstResultSummary
