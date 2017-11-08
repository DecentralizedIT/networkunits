module.exports = {
  networks: {
    test: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    main: {
      host: "localhost",
      port: 8547,
      network_id: 1, // Official Ethereum network 
      from: "0xC2264F8cD959266CfcAa13124876E4654081e1Ea"
    }
  }
};
