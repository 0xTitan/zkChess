# zkChess
Provable chess game. Moves are sent via email. It uses :
 - ZkEmail - https://zkemail.gitbook.io/zk-email
 - Hylé - https://docs.hyle.eu/developers/

 Compile circuit from root :
 ```circom -l node_modules circuit/zkchess.circom -o --r1cs --wasm --sym --c --O0``` 

Generate file input.json :
 ```npx ts-node inputs.ts```

Compute witness :
 ```node zkchess_js/generate_witness.js zkchess_js/zkchess.wasm input.json witness.wtns``` 
