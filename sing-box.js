const { type, name } = $arguments
const compatible_outbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
}

let compatible
let config = JSON.parse($files[0])
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
})

config.outbounds.push(...proxies)

config.outbounds.map(i => {
  if (['hk'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /香港|hk/i))
  }
  if (['sg'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /新加坡|sg/i))
  }
  if (['jp'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /日本|jp/i))
  }
  if (['us'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /美国|us/i))
  }
  if (['eu'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /英国|法国|德国|荷兰|uk|fr|de|nl/i))
  }
  if (['other'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /^(?!.*(?:剩余|到期|香港|hk|新加坡|sg|日本|jp|美国|us|英国|法国|德国|荷兰|uk|fr|de|nl)).*/i))
  }
})

config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatible_outbound)
      compatible = true
    }
    outbound.outbounds.push(compatible_outbound.tag);
  }
});

$content = JSON.stringify(config, null, 2)

function getTags(proxies, regex) {
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag)
}