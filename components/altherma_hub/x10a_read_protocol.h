#pragma once

// Read-only X10A framing helpers, ported (trimmed) from jjohnsen/esphome-altherma PR #51.
// Only what the identify service needs: no memory, RAM or field-setting commands.
#include <cstddef>
#include <cstdint>
#include <cstring>

namespace esphome {
namespace altherma_hub {
namespace x10a {

inline uint8_t checksum(const uint8_t *bytes, size_t length) {
  uint8_t sum = 0;
  for (size_t i = 0; i < length; i++) sum = static_cast<uint8_t>(sum + bytes[i]);
  return static_cast<uint8_t>(~sum);
}

// Request: [length excluding first byte and CRC][command][data...][CRC].
inline size_t build_frame(uint8_t command, const uint8_t *data, size_t data_length,
                          uint8_t *frame, size_t capacity) {
  if (frame == nullptr || data_length > 252 || capacity < data_length + 3 ||
      (data_length != 0 && data == nullptr)) return 0;
  frame[0] = static_cast<uint8_t>(data_length + 2);
  frame[1] = command;
  if (data_length != 0) std::memcpy(frame + 2, data, data_length);
  frame[data_length + 2] = checksum(frame, data_length + 2);
  return data_length + 3;
}

// Controller replies do not start with a length byte.
inline bool valid_reply(const uint8_t *reply, size_t length, uint8_t command) {
  return reply != nullptr && length >= 2 && reply[0] == command &&
         checksum(reply, length - 1) == reply[length - 1];
}

// Daikin Configurator auto-detect (V command): reply is
// [0x56, Micon ID low byte, Micon ID high byte, checksum].
inline bool decode_micon_id(const uint8_t *reply, size_t length, uint16_t &micon_id) {
  if (length != 4 || !valid_reply(reply, length, 0x56)) return false;
  micon_id = static_cast<uint16_t>(reply[1]) | (static_cast<uint16_t>(reply[2]) << 8);
  return true;
}

inline bool nack(const uint8_t *reply, size_t length) {
  return reply != nullptr && length == 2 && reply[0] == 0x15 && reply[1] == 0xEA;
}

}  // namespace x10a
}  // namespace altherma_hub
}  // namespace esphome
