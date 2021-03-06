const sf = require('streamforge');

var p = sf.Pipeline("runny-simple-broadcast").withComponent(
	sf.Zip("bitcoin-calculation")
	.withProcess(function(p1, p2) {
		var r = {
			'amount': (p1.amount * p2.body.result.price.last)
		}
		return r;
	})
	.withSource(
		sf.Source(sf.PredefinedSources.BITCOIN_TRANSACTIONS).withThrottling(1,1)
	)
	.withSource(
		sf.Source(sf.PredefinedSources.ICO_PARITY, function(s) {
			return s.ico == 'btc' &&
				s.currency == 'usd' ;
		}).withThrottling(1,1)
	)
).withComponent(
	sf.Zip("ethereum-calculation")
	.withProcess(function(p1, p2) {
		var r = {
			'amount': (p1.amount * p2.body.result.price.last)
		}
		return r;
	})
	.withSource(
		sf.Source(sf.PredefinedSources.ETHEREUM_PENDING_TRANSACTIONS).withThrottling(1,1)
	)
	.withSource(
		sf.Source(sf.PredefinedSources.ICO_PARITY, function(s) {
			return s.ico == 'eth' &&
				s.currency == 'usd';
		}).withThrottling(1,1)
	)
).withComponent(
    sf.Zip("compare", true)
	.withProcess(function(p1, p2) {
		print("biii");
		var amount = {
			"btc-usd-amount": p1.amount,
            "eth-usd-amount": p2.amount,
            "date" : new Date()
        };
        return {"request" : JSON.stringify(amount)};
	}).withSource(sf.Source("bitcoin-calculation"))
    .withSource(sf.Source("ethereum-calculation"))
).withComponent(
	sf.Broadcast("broadcast","compare",2)
	.toSink(sf.APISink("api-compare-1","http://www.mocky.io/v2/5cacee8e2f000077003a9428",
    {   "http.method":"POST",
		"http.api-key":"8d77f7d14a4864931f15072255fc1b58de8941cd45a8a896ed4ebf99b93d2e33"}))
		.toSink(sf.WSSink("ws-compare","ws://localhost:4498",
		{   "http.method":"POST",
			"http.api-key":"8d77f7d14a4864931f15072255fc1b58de8941cd45a8a896ed4ebf99b93d2e33"}))	
)

//console.log(JSON.stringify(p));
p.compile();