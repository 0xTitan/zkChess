pragma circom 2.1.6;
include "@zk-email/zk-regex-circom/circuits/common/from_addr_regex.circom";
include "@zk-email/circuits/email-verifier.circom";
include "@zk-email/circuits/utils/regex.circom";

include "./zkchess-mail-regex.circom";


template ZkChessVerifier(maxHeadersLength, maxBodyLength, n, k, exposeFrom) {
     assert(n*k >1024);

    signal input emailHeader[maxHeadersLength];
    signal input emailHeaderLength;
    signal input pubkey[k];
    signal input signature[k];
    signal input emailBody[maxBodyLength];
    signal input emailBodyLength;
    signal input bodyHashIndex;
    signal input precomputedSHA[32];
  

    component EV = EmailVerifier(maxHeadersLength, maxBodyLength, n, k, 0);
    EV.emailHeader <== emailHeader;
    EV.pubkey <== pubkey;
    EV.signature <== signature;
    EV.emailHeaderLength <== emailHeaderLength;
    EV.bodyHashIndex <==bodyHashIndex;
    EV.precomputedSHA <==precomputedSHA;
    EV.emailBody<==emailBody;
    EV.emailBodyLength<==emailBodyLength;


    signal output pubkeyHash;
    pubkeyHash <== EV.pubkeyHash;
 
    signal output hyleData[8];
    hyleData <== [104,121,102,101,68,97,116,97];
    
    signal (chessMoveFound, chessMoveReveal[maxBodyLength]);
    (chessMoveFound,chessMoveReveal)  <== ZkChessMailRegex(maxBodyLength)(emailBody);
    chessMoveFound === 1;

    // Pack the move to int
    signal input moveIndex;
    var maxMoveLength = 50;
    signal output usernamePackedOut[computeIntChunkLength(maxMoveLength)];
    usernamePackedOut <== PackRegexReveal(maxBodyLength, maxMoveLength)(chessMoveReveal, moveIndex);
}

component main = ZkChessVerifier(576, 832, 121, 17, 0);