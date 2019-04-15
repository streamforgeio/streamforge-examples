const sf = require('streamforge');

var p = sf.Pipeline("runny").withComponent(
	sf.Zip("bitcoin-calculation")
	.withProcess(function(p1, p2) {
		var r = {
			'amount': (p1.amount * p2.body.result.price.last)
		}
		return r;
	})
	.withSource(
		sf.Source("btc-raw", sf.DataSourceType.GLOBAL).withThrottling(1,1)
	)
	.withSource(
		sf.Source("ico-parity", sf.DataSourceType.GLOBAL, function(s) {
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
		sf.Source("eth-pending", sf.DataSourceType.GLOBAL).withThrottling(1,1)
	)
	.withSource(
		sf.Source("ico-parity", sf.DataSourceType.GLOBAL, function(s) {
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
	}).withSource(sf.Source("bitcoin-calculation", sf.DataSourceType.LOCAL))
    .withSource(sf.Source("ethereum-calculation", sf.DataSourceType.LOCAL))
).withComponent(
	sf.Broadcast("broadcast","compare",2)
).withComponent(
	sf.Merge("merge",2)
	.withSource("broadcast~0")
	.withSource("broadcast~1")
	.toSink(sf.APISink("api-compare","http://jumphost.streamforge.io:8080/api/trxs",
    {   "http.method":"POST",
        "http.api-key":"8d77f7d14a4864931f15072255fc1b58de8941cd45a8a896ed4ebf99b93d2e33"}))
)

//console.log(JSON.stringify(p));
p.compile();