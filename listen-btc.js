const sf = require('streamforge');

console.log('version 3')
var p = sf.Pipeline("total-btc-trx-1-min").withComponent(
	sf.Flow("bitcoin-trx-listener")
	.withProcess(function(p1) {
		var r = {
			'amount': p1.amount,'txId':p1.txId,
            "date" : new Date()
		}
		return {"request" : JSON.stringify(r)};
	})
	.withSource(
		sf.Source("btc-raw", sf.DataSourceType.GLOBAL,function(s) {
			return 	s.amount > 2;
		})
	).toSink(sf.APISink("api-compare","http://jumphost.streamforge.io:8080/api/trxs",
    {   "http.method":"POST",
        "http.api-key":"8d77f7d14a4864931f15072255fc1b58de8941cd45a8a896ed4ebf99b93d2e33"}))
)
p.compile();