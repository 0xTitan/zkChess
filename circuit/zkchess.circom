pragma circom 2.1.6;
include "@zk-email/zk-regex-circom/circuits/common/from_addr_regex.circom";
include "@zk-email/circuits/email-verifier.circom";
include "@zk-email/circuits/utils/regex.circom";

include "./zkchess-mail-regex.circom";


template ZkChessVerifier(maxHeadersLength, maxBodyLength, n, k, exposeFrom) {
     assert(exposeFrom < 2);

    signal input emailHeader[maxHeadersLength];
    signal input emailHeaderLength;
    signal input pubkey[k];
    signal input signature[k];
    signal input emailBody[maxBodyLength];
    signal input emailBodyLength;
    signal input bodyHashIndex;
    signal input precomputedSHA[32];
    signal input twitterUsernameIndex;
    signal input address; // we don't need to constrain the + 1 due to https://geometry.xyz/notebook/groth16-malleability


    signal output pubkeyHash;
    signal output twitterUsername;


    component EV = EmailVerifier(maxHeadersLength, maxBodyLength, n, k, 0);
    EV.emailHeader <== emailHeader;
    EV.pubkey <== pubkey;
    EV.signature <== signature;
    EV.emailHeaderLength <== emailHeaderLength;
    EV.bodyHashIndex <== bodyHashIndex;
    EV.precomputedSHA <== precomputedSHA;
    EV.emailBody <== emailBody;
    EV.emailBodyLength <== emailBodyLength;

    pubkeyHash <== EV.pubkeyHash;


    // FROM HEADER REGEX: 736,553 constraints
    if (exposeFrom) {
        signal input fromEmailIndex;

        signal (fromEmailFound, fromEmailReveal[maxHeadersLength]) <== FromAddrRegex(maxHeadersLength)(emailHeader);
        fromEmailFound === 1;

        var maxEmailLength = 255;

        signal output fromEmailAddrPacks[9] <== PackRegexReveal(maxHeadersLength, maxEmailLength)(fromEmailReveal, fromEmailIndex);
    }


    // TWITTER REGEX: 328,044 constraints
    // This computes the regex states on each character in the email body. For other apps, this is the
    // section that you want to swap out via using the zk-regex library.
    signal (twitterFound, twitterReveal[maxBodyLength]) <== ZkChessMailRegex(maxBodyLength)(emailBody);
    twitterFound === 1;

    // Pack the username to int
    var maxTwitterUsernameLength = 21;
    signal twitterUsernamePacks[1] <== PackRegexReveal(maxBodyLength, maxTwitterUsernameLength)(twitterReveal, twitterUsernameIndex);
   
    // Username will fit in one field element, so we take the first item from the packed array.
    twitterUsername <== twitterUsernamePacks[0];
}

component main { public [ address ] } = ZkChessVerifier(1024, 1536, 121, 17, 0);