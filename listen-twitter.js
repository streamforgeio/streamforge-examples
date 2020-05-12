const sf = require('streamforge');

console.log('version 3')
var p = sf.Pipeline("total-btc-trx-1-min").withComponent(
	sf.Flow("bitcoin-trx-listener")
	.withProcess(function(p1) {
		var r = {
			'tweet': p1,
            "date" : new Date()
		}
		return {"request" : JSON.stringify(r)};
	})
	.withSource(
		sf.Source(sf.PredefinedSources.TwitterSentiment(sf.Param("consumer_key", "5ulYuGiY024IkuzoBfXgOB5fX" ),
		sf.Param("consumer_secret","ldg16Kab1S5WY30foPwJJ526Enif1KrnuKey75A0Ld09DECaI9"),
		sf.Param("access_token","64170750-3WkVXz70Xz7r97rmghgqPcsigeQdcawNILVRygtih"),
		sf.Param("access_token_secret","BIY5zBK20eqFwv66VcCaP0wBDF3Sh22plG77SGQn4ITNk"),
		sf.Param("tracks","#bitcoin")))
	).toSink(sf.LogSink("twitter-out"))
)
p.compile();