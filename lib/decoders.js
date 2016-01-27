/*
# Copyright (c) 2015 Blizzard Entertainment
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
*/

function TruncateError(message) {
  this.name = 'TruncateError';
  this.message = message || 'truncate error';
  Error.captureStackTrace(this);
}
TruncateError.prototype = Object.create(Error.prototype);
TruncateError.prototype.constructor = TruncateError;
exports.TruncateError = TruncateError;

function CorruptedError(message) {
  this.name = 'CorruptedError';
  this.message = message || 'corrupted  error';
  Error.captureStackTrace(this);
}
CorruptedError.prototype = Object.create(Error.prototype);
CorruptedError.prototype.constructor = CorruptedError;
exports.CorruptedError = CorruptedError;


function BitPackedBuffer(contents, endian) {
  if (!endian) endian = 'big';
  
  this._data = contents || [];
  this._used = 0;
  this._next = null;
  this._nextbits = 0;
  this._bigendian = endian === 'big';
}
exports.BitPackedBuffer = BitPackedBuffer;

BitPackedBuffer.prototype.toString = function() {
  console.log(this._data);
  return 'buffer(' +
    (this._nextbits && this._next || 0).toString(16) + '/' + this._nextbits +
    ',[' + this._used + ']=' + ((this._used < this._data.length) ? this._data.readUInt8(this._used).toString(16) : '--') + 
  ')';
};

BitPackedBuffer.prototype.done = function() {
  return this._nextbits === 0 && this._used >= this._data.length;
};

BitPackedBuffer.prototype.usedBits = function() {
  return this._used * 8 - this._nextbits;
};

BitPackedBuffer.prototype.byteAlign = function() {
  this._nextbits = 0;
};

BitPackedBuffer.prototype.readAlignedBytes = function(bytes) {
  this.byteAlign();
  var data = this._data.slice(this._used, this._used + bytes);
  this._used += bytes;
  if (data.length !== bytes) {
    throw new TruncateError(this.toString());
  }
  return data;
};

BitPackedBuffer.prototype.readBits = function(bits) {
  var result = 0;
  var resultbits = 0;
  
  while (resultbits !== bits) {
    if (this._nextbits === 0) {
      if (this.done()) throw new TruncateError(this.toString());
      this._next = this._data.readUInt8(this._used);
      this._used += 1;
      this._nextbits = 8;
    }
    
    var copybits = Math.min(bits - resultbits, this._nextbits);
    var copy = this._next & ((1 << copybits) - 1);
    
    if (this._bigendian)
      result |= copy << (bits - resultbits - copybits);
    else
      result |= copy << resultbits;
    
    this._next >>= copybits;
    this._nextbits -= copybits;
    resultbits += copybits;
  }
  
  return result;
};

BitPackedBuffer.prototype.readUnalignedBytes = function(bytes) {
  // not sure, to test
  var buff = new Buffer(bytes);
  for (var i = 0; i < bytes; i += 1) {
    buff.writeUInt8(this.read(8));
  }
  return buff.toString(); // should maybe return buffer instead of string?
};


function BitPackedDecoder(contents, typeinfos) {
  this._buffer = new BitPackedBuffer(contents);
  this._typeinfos = typeinfos;
}
exports.BitPackedDecoder = BitPackedDecoder;

BitPackedDecoder.prototype.toString = function() {
  return this._buffer.toString();
};

BitPackedDecoder.prototype.instance = function(typeid) {
  if (typeid >= this._typeinfos.length) throw new CorruptedError(this.toString());
  var typeinfo = this._typeinfos[typeid];
  return this[typeinfo[0]].apply(this, typeinfo[1]);
};

BitPackedDecoder.prototype.byteAlign = function() {
  this._buffer.byteAlign();
};

BitPackedDecoder.prototype.done = function() {
  return this._buffer.done();
};

BitPackedDecoder.prototype.usedBits = function() {
  return this._buffer.usedBits();
};

BitPackedDecoder.prototype._array = function(bounds, typeid) {
  var length = this._int(bounds);
  var ar = [];
  for (var i = 0; i < length; i += 1) {
    ar[i] = this.instance(typeid);
  }
  return ar;
};

BitPackedDecoder.prototype._bitarray = function(bounds) {
  var length = this._int(bounds);
  return [length, this._buffer.readBits(length)];
};

BitPackedDecoder.prototype._blob = function(bounds) {
  var length = this._int(bounds);
  return this._buffer.readAlignedBytes(length);
};

BitPackedDecoder.prototype._bool = function() {
  return this._int([0, 1]) !== 0;
};

BitPackedDecoder.prototype._choice = function(bounds, fields) {
  var tag = this._int(bounds);
  var field = fields[tag];
  if (!field) throw new CorruptedError(this.toString());
  var ret = {};
  ret[field[0]] = this.instance(field[1]);
  return ret;
};

BitPackedDecoder.prototype._fourcc = function() {
  return this._buffer.readUnalignedBytes(4);
};

BitPackedDecoder.prototype._int = function(bounds) {
  var value = bounds[0] + this._buffer.readBits(bounds[1]);
  return value;
};

BitPackedDecoder.prototype._null = function() {
  return null;
};

BitPackedDecoder.prototype._optional = function(typeid) {
  var exists = this._bool();
  return exists ? this.instance(typeid) : null;
};

BitPackedDecoder.prototype._real32 = function() {
  return this._buffer.readUnalignedBytes(4).readFloatBE(0);
};

BitPackedDecoder.prototype._real64 = function() {
  return this._buffer.readUnalignedBytes(8).readDoubleBE(0);
};

BitPackedDecoder.prototype._struct = function(fields) {
  var result = {};
  
  fields.forEach(field => {
    if (field[0] === '__parent') {
      console.trace('handle');
      throw 'handle';
      var parent = this.instance(field[1]);
    } else {
      result[field[0]] = this.instance(field[1]);
    }
  });
  
  return result;
};


function VersionDecoder(contents, typeinfos) {
  this._buffer = new BitPackedBuffer(contents);
  this._typeinfos = typeinfos;
}
exports.VersionDecoder = VersionDecoder;

VersionDecoder.prototype.toString = function() {
  return this._buffer.toString();
};

VersionDecoder.prototype.instance = function(typeid) {
  if (typeid >= this._typeinfos.length) throw new CorruptedError(this.toString());
  
  var typeinfo = this._typeinfos[typeid];
  return this[typeinfo[0]].apply(this, typeinfo[1]);
};

VersionDecoder.prototype.byteAlign = function() {
  this._buffer.byteAlign();
};

VersionDecoder.prototype.done = function() {
  return this._buffer.done();
};

VersionDecoder.prototype.usedBits = function() {
  return this._buffer.usedBits();
};

VersionDecoder.prototype._expectSkip = function(expected) {
  var r = this._buffer.readBits(8);
  if (r !== expected) throw new CorruptedError(this.toString());
};

VersionDecoder.prototype._vint = function() {
  var b = this._buffer.readBits(8);
  var negative = b & 1;
  var result = (b >> 1) & 0x3f;
  var bits = 6;
  
  while ((b & 0x80) !== 0) {
    b = this._buffer.readBits(8);
    result |= (b & 0x7f) << bits;
    bits += 7;
  }
  
  return negative ? -result : result;
};

VersionDecoder.prototype._array = function(bounds, typeid) {
  this._expectSkip(0);
  var length = this._vint();
  var ar = [];
  for (var i = 0; i < length; i += 1) {
    ar[i] = this.instance(typeid);
  }
  return ar;
};

VersionDecoder.prototype._bitarray = function(bounds) {
  this._expectSkip(1);
  var length = this._vint();
  return [length, this._buffer.readAlignedBytes((length + 7) / 8)];
};

VersionDecoder.prototype._blob = function(bounds) {
  this._expectSkip(2);
  var length = this._vint();
  return this._buffer.readAlignedBytes(length);
};

VersionDecoder.prototype._bool = function() {
  this._expectSkip(6);
  return this._buffer.readBits(8) !== 0;
};

VersionDecoder.prototype._choice = function(bounds, fields) {
  this._expectSkip(3);
  var tag = this._vint();
  var field = fields[tag];
  if (!field) {
    this._skipInstance();
    return {};
  }
  var ret = {};
  ret[field[0]] = this.instance(field[1]);
  return ret;
};

VersionDecoder.prototype._fourcc = function() {
  this._expectSkip(7);
  return this._buffer.readAlignedBytes(4);
};

VersionDecoder.prototype._int = function() {
  this._expectSkip(9);
  return this._vint();
};

VersionDecoder.prototype._null = function() {
  return null;
};

VersionDecoder.prototype._optional = function(typeid) {
  this._expectSkip(4);
  var exists = this._buffer.readBits(8) !== 0;
  return exists ? this.instance(typeid) : null;
};

VersionDecoder.prototype._real32 = function() {
  this._expectSkip(7);
  return this._buffer.readAlignedBytes(4).readFloatBE(0);
};

VersionDecoder.prototype._real64 = function() {
  this._expectSkip(8);
  return this._buffer.readAlignedBytes(8).readDoubleBE(0);
};

VersionDecoder.prototype._struct = function(fields) {
  this._expectSkip(5);
  
  var result = {};
  var length = this._vint();
  
  for (var i = 0; i < length; i += 1) {
    var tag = this._vint();
    var field = fields.find(field => field[2] === tag);
    
    if (field) {
      if (field[0] === '__parent') {
        console.trace('handle');
        throw 'handle';
      } else {
        result[field[0]] = this.instance(field[1]);
      }
    } else {
      this._skipInstance();
    }
  }
  
  return result;
};

VersionDecoder.prototype._skipInstance = function() {
  var skip = this._buffer.readBits(8), length, exists, i, tag;
  
  if (skip === 0) {        // array
    length = this._vint();
    for (i = 0; i < length; i += 1) {
      this._skipInstance();
    }
  } else if (skip === 1) { // bitblob
    length = this._vint();
    this._buffer.readAlignedBytes((length + 7) / 8);
  } else if (skip === 2) { // blob
    length = this._vint();
    this._buffer.readAlignedBytes(length);
  } else if (skip === 3) { // choice
    tag = this._vint();
    this._skipInstance();
  } else if (skip === 4) { // optional
    exists = this._buffer.readBits(8) !== 0;
    if (exists) this._skipInstance();
  } else if (skip === 5) { // struct
    length = this._vint();
    for (i = 0; i < length; i += 1) {
      tag = this._vint();
      this._skipInstance();
    }
  } else if (skip === 6) { // u8
    this._buffer.readAlignedBytes(1);
  } else if (skip === 7) { // u32
    this._buffer.readAlignedBytes(4);
  } else if (skip === 8) { // u64
    this._buffer.readAlignedBytes(8);
  } else if (skip === 9) { // vint
    this._vint();
  }
};
