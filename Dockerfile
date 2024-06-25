
# solcjs --bin --abi --include-path node_modules/ --base-path . -o . SimpleStorage.sol
# git push --set-upstream origin container-setup

FROM node:18

WORKDIR /app

COPY . .

RUN apt-get update && apt-get install -y expect jq git && \
    npm init --yes && npm install --save-dev hardhat && \
    npm install --save-dev @nomiclabs/hardhat-etherscan && \
    npm install --save-dev hardhat-gas-reporter@1.0.8 && \
    npm install --save-dev solidity-coverage && \
    npm install --save-dev solhint && \
    npm install --save-dev @chainlink/contracts && \
    npm install --save-dev hardhat-deploy && \
    npm install solc && npm install -g solc@0.8.7-fixed && \
    npm install --save ethers@6.1.0 && \
    npm install dotenv --save && \
    npm install --dev prettier prettier-plugin-solidity && \
    rm -rf /var/lib/apt/lists/* && apt-get clean \ 
    chmod +x shell/auto-hardhat.exp && expect shell/auto-hardhat.exp && \
    sh shell/apply_prettier.sh && rm -rf shell && \
    rm contracts/Lock.sol && \
    git config --global user.name "aperisss" && \
    git config --global user.email "peris.adam@outlook.fr" && \
    git stash --include-untracked && git checkout main && \
    git fetch origin && git reset --hard origin/main && \
    npm install --save-dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers

CMD ["bash"]


 