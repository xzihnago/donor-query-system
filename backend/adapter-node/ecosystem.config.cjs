module.exports = {
  apps: [
    {
      name: "donor-query-system",
      script: "src/index.ts",
      interpreter: "node",
      interpreterArgs: "--import tsx",
    },
  ],
};
