const displayNPRCurrency = (num) => {
    const formatter = new Intl.NumberFormat('en-NP', {
        style: 'currency',
        currency: 'NPR',
        currencyDisplay: 'symbol',
        minimumFractionDigits: 2
    });

    return formatter.format(num).replace(/NPR/g, 'Rs.'); // Replace NPR with Rs. for English representation
}

export default displayNPRCurrency;
