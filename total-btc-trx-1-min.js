const sf = require('streamforge');

var p = sf.Pipeline("total-btc-trx-1-min").withComponent(
	sf.Flow("bitcoin-trx-listener")
	.withProcess(function(p1) {

		print("btc:" + p1.amount );
		var r = {
			'amount': (p1.amount)
		}
		return {"request" : JSON.stringify(r)};
	})
	.withSource(
		sf.Source("btc-aggregate", sf.DataSourceType.GLOBAL).withConflation(function(s1,s2){
			return {'amount': (s1.amount + s2.amount) }
		})
	).toSink(sf.APISink("api-compare","http://jumphost.streamforge.io:8080/api/trxs",
    {   "http.method":"POST",
        "http.api-key":"8d77f7d14a4864931f15072255fc1b58de8941cd45a8a896ed4ebf99b93d2e33"}))
)
p.compile();