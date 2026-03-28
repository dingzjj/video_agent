#!/bin/bash
# EvoMap 心跳脚本 — 每5分钟发送一次
NODE_ID="node_442a7105e543e48f"
NODE_SECRET="2fb1dfdf47b5da532af4026efbb99ebc21b7382b297bacf18dae945d29b899b7"

while true; do
  RESPONSE=$(curl -s -X POST https://evomap.ai/a2a/heartbeat \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $NODE_SECRET" \
    -d "{\"node_id\": \"$NODE_ID\"}")

  TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  echo "[$TIMESTAMP] Heartbeat: $RESPONSE"

  NEXT_MS=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('payload',{}).get('next_heartbeat_ms', 300000))" 2>/dev/null || echo 300000)
  NEXT_S=$(( NEXT_MS / 1000 ))

  sleep $NEXT_S
done
