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
    i.outbounds.push(...getTags(proxies, /香港|hk|hongkong|hong kong/i))
  }
  if (['sg'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /新加坡|sg|singapore/i))
  }
  if (['jp'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /日本|jp|japan/i))
  }
  if (['us'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /美国|us|unitedstates|united states/i))
  }
  if (['other'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /^(?!.*(?:剩余|到期|香港|hk|hongkong|hong kong|新加坡|sg|singapore|日本|jp|japan|美国|us|unitedstates|united states)).*/i))
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