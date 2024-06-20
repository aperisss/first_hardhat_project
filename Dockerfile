
# solcjs --bin --abi --include-path node_modules/ --base-path . -o . SimpleStorage.sol

FROM node:18

WORKDIR /app

COPY . .

RUN apt-get update && apt-get install -y expect jq git && \
    git config --global user.name "aperisss" && \
    git config --global user.email "peris.adam@outlook.fr" && \
    npm init --yes && npm install --save-dev hardhat && \
    npm install solc && npm install -g solc@0.8.7-fixed && \
    npm install --save ethers@6.1.0 && \
    npm install dotenv --save && \
    npm install --dev prettier prettier-plugin-solidity && \
    rm -rf /var/lib/apt/lists/* && apt-get clean \ 
    chmod +x shell/auto-hardhat.exp && expect shell/auto-hardhat.exp && \
    sh shell/apply_prettier.sh && rm -rf shell && \
    rm contracts/Lock.sol

CMD ["bash"]


 