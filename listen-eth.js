const sf = require('streamforge');

var p = sf.Pipeline("total-btc-trx-1-min").withComponent(
	sf.Flow("ethereum-trx-listener")
	.withProcess(function(p1) {
		var r = {
			'amount': p1.amount,'txId':p1.txId,
            "date" : new Date()
		}
		return {"request" : JSON.stringify(r)};
	})
	.withSource(
		sf.Source(sf.PredefinedSources.ETHEREUM_PENDING_TRANSACTIONS).withThrottling(1,1)/*.withConflation(function(s1,s2){
			print("eth-txId:" + s2.txId );
			return {'amount': (s1.amount + s2.amount),'txId':'total' }
		})*/
	).toSink(sf.APISink("api-compare","http://jumphost.streamforge.io:8080/api/trxs",
    {   "http.method":"POST",
        "http.api-key":"8d77f7d14a4864931f15072255fc1b58de8941cd45a8a896ed4ebf99b93d2e33"}))
)
p.compile();