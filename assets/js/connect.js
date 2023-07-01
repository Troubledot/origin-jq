// 点击连接钱包的按钮
$(document).ready(function () {
    let isConnected = false;
    const setStatus = account => {
        if (account) {
            isConnected = true;
            const str = account.slice(0, 4) + '...' + account.slice(account.length - 5, account.length);
            $('.wallet .button-txt span').text(str);
            $('.wallet .button-txt-ap').text('Disconnect');
            $('.wallet .copy').show();
            $('.wallet .copy').attr({
                'data-clipboard-text': account
            });
        } else {
            isConnected = false;
            $('.wallet .button-txt span').text('Connect Wallet');
            $('.wallet .button-txt-ap').text('Connect Wallet');
            $('.wallet .copy').hide();
        }
    };
    $('#connectWalletButton').click(async function () {
        // 检查是否有 MetaMask 钱包已经安装
        if (typeof window.ethereum !== 'undefined') {
            // 请求用户授权连接钱包
            if (isConnected) {
                const web3 = new Web3(window.ethereum);

                // 断开与 MetaMask 钱包的连接
                const data = await web3.currentProvider.disconnect();
                setStatus(false);
            } else {
                window.ethereum
                    .request({ method: 'eth_requestAccounts' })
                    .then(function (accounts) {
                        // 连接成功，获取当前账户地址
                        var currentAccount = accounts[0];
                        setStatus(currentAccount);
                        console.log('Connected to MetaMask. Current account:', currentAccount);
                        // 在此处执行其他与钱包交互的逻辑
                    })
                    .catch(function (error) {
                        setStatus(false);
                        // 连接失败或用户拒绝连接
                        console.error('Failed to connect to MetaMask:', error);
                    });
            }
        } else {
            // 如果没有安装 MetaMask 钱包
            console.error('MetaMask is not installed.');
        }
    });

    async function getAccount() {
        if (window.ethereum && window.ethereum.isConnected()) {
            try {
                // 请求账户信息
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });

                if (accounts.length > 0) {
                    const address = accounts[0];
                    setStatus(address);
                    console.log('已连接账户地址:', address);
                    // 进一步操作...
                } else {
                    console.log('未连接账户');
                    setStatus(false);
                    // 提示用户连接账户
                }
            } catch (error) {
                console.error('获取账户信息失败:', error);
            }
        } else {
            console.log('请连接 MetaMask');
            // 提示用户连接 MetaMask
        }
    }

    var clipboard = new ClipboardJS('#copyAccount');
    clipboard.on('success', function (e) {
        alert('成功复制账户！');
        e.clearSelection();
    });

    clipboard.on('error', function (e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    });
    clipboard.on('success', function (e) {
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);
        e.clearSelection();
    });

    getAccount();
});
