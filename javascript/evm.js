/**
 * EVM From Scratch
 * JavaScript template
 *
 * To work on EVM From Scratch in JavaScript:
 *
 * - Install Node.js: https://nodejs.org/en/download/
 * - Edit `javascript/evm.js` (this file!), see TODO below
 * - Run `node javascript/evm.js` to run the tests
 *
 * If you prefer TypeScript, there's a sample TypeScript template in the `typescript` directory.
 */

function evm(code) {
	console.log('\n')
	// console.log('CODE_INPUT: ', code)

	let pc = 0
	let stack = []
	let memory = []

	while (pc < code.length) {
		let opcode = code[pc].toString(16)
		// console.log('OPCODE23: ', opcode)

		pc++
		switch (true) {
			// Stack Input	        Stack Output
			case '0' == opcode:
				// STOP
				return { success: true, stack }

			case '1' == opcode:
				// ADD
				let x01_arg_1 = stack.shift()
				let x01_arg_2 = stack.shift()

				let toStack = (x01_arg_1 + x01_arg_2) % 2n ** 256n

				stack.unshift(toStack)
				break

			case '2' == opcode:
				// MUL
				let x02_arg_1 = stack.shift()
				let x02_arg_2 = stack.shift()

				stack.unshift((x02_arg_1 * x02_arg_2) % 2n ** 256n)
				break

			case '3' == opcode:
				// SUB
				let x03_arg_1 = stack.shift()
				let x03_arg_2 = stack.shift()

				if (x03_arg_1 < x03_arg_2) {
					stack.unshift(2n ** 256n - (x03_arg_2 - x03_arg_1))
					break
				}

				stack.unshift((x03_arg_1 - x03_arg_2) % 2n ** 256n)
				break

			case '4' == opcode:
				// DIV
				let x04_arg_1 = stack.shift()
				let x04_arg_2 = stack.shift()

				if (x04_arg_2 == 0n) {
					stack.unshift(0n)
					break
				}
				stack.unshift((x04_arg_1 / x04_arg_2) % 2n ** 256n)
				break

			case '5' == opcode:
				// SDIV
				let x05_arg_1 = stack.shift()
				let x05_arg_2 = stack.shift()

				if (x05_arg_2 == 0n) {
					stack.unshift(0n)
					break
				}

				console.log('___________________________')
				console.log('x05_arg_1: ', x05_arg_1)
				console.log('x05_arg_1_bin: ', x05_arg_1.toString(2))

				console.log('x05_arg_2: ', x05_arg_2)
				console.log('x05_arg_2_bin: ', x05_arg_2.toString(2))
				// console.log('TEST: ', -15n / -3n)

				console.log('x05_arg_1.toString(2) / x05_arg_2.toString(2)')
				console.log(x05_arg_1.toString(2) / x05_arg_2.toString(2))

				stack.unshift(x05_arg_1.toString(2) / x05_arg_2.toString(2))
				// IN PROGRESS
				break

			case '6' == opcode:
				// MOD
				let x06_arg_1 = stack.shift()
				let x06_arg_2 = stack.shift()

				if (x06_arg_2 == 0n) {
					stack.unshift(0n)
					break
				}
				stack.unshift(x06_arg_1 % x06_arg_2)
				break

			case '8' == opcode:
				// ADDMOD
				let x08_arg_1 = stack.shift()
				let x08_arg_2 = stack.shift()
				let x08_arg_3 = stack.shift()

				if (x08_arg_3 == 0n) {
					stack.unshift(0n)
					break
				}
				stack.unshift((x08_arg_1 + x08_arg_2) % x08_arg_3)
				break

			case '9' == opcode:
				// MULMOD
				let x09_arg_1 = stack.shift()
				let x09_arg_2 = stack.shift()
				let x09_arg_3 = stack.shift()

				if (x09_arg_3 == 0n) {
					stack.unshift(0n)
					break
				}
				stack.unshift((x09_arg_1 * x09_arg_2) % x09_arg_3)
				break

			case 'a' == opcode:
				// EXP
				let x0a_arg_1 = stack.shift()
				let x0a_arg_2 = stack.shift()

				stack.unshift(x0a_arg_1 ** x0a_arg_2 % 2n ** 256n)
				break

			case 'b' == opcode:
				// SIGNEXTEND
				let x0b_arg_1 = stack.shift()
				let x0b_arg_2 = stack.shift()

				let sign = x0b_arg_2.toString(2).padStart(8, 0)[0]

				if (sign === '0') {
					// positive
					stack.unshift(x0b_arg_2 >> x0b_arg_1)
					break
				}

				// negative
				stack.unshift(x0b_arg_2 | ((2n ** 256n - 1n) << (x0b_arg_1 * 8n)))

				break

			case '33' == opcode:
				// CALLER
				break
			case '50' == opcode:
				// POP
				stack.shift()

				break

			// OPCODE 60 t/m 7F
			case parseInt(opcode, 16) >= 96 && parseInt(opcode, 16) <= 127:
				// PUSH1 - PUSH32
				//(0011 << 2n) = 1100
				// 1100 | 0001 = 1101
				let output = BigInt(code[pc++])
				// console.log('_Output: ', output)
				for (let byte = 1; byte < parseInt(opcode, 16) - 95; byte++) {
					let toStack = BigInt(code[pc++])
					if (toStack != 0) {
						output = (output << 8n) | toStack
					}
				}

				// console.log('output: ', output)
				stack.unshift(output)
				break
		}
	}

	return { success: true, stack }
}

function tests() {
	const tests = require('../evm.json')

	const hexStringToUint8Array = (hexString) =>
		new Uint8Array(hexString.match(/../g).map((byte) => parseInt(byte, 16)))

	const total = Object.keys(tests).length
	let passed = 0

	try {
		for (const t of tests) {
			console.log('Test #' + (passed + 1), t.name)
			try {
				// Note: as the test cases get more complex, you'll need to modify this
				// to pass down more arguments to the evm function
				const result = evm(hexStringToUint8Array(t.code.bin))

				if (result.success !== t.expect.success) {
					throw new Error(
						`Expected success=${t.expect.success}, got success=${result.success}`
					)
				}

				const expectedStackHex = t.expect.stack
				const actualStackHex = result.stack.map((v) => '0x' + v.toString(16))

				if (expectedStackHex.join(',') !== actualStackHex.join(',')) {
					console.log('expected stack:', expectedStackHex)
					console.log('  actual stack:', actualStackHex)
					throw new Error('Stack mismatch')
				}
			} catch (e) {
				console.log(`\n\nCode of the failing test (${t.name}):\n`)
				console.log(t.code.asm.replaceAll(/^/gm, '  '))
				console.log(`\n\nHint: ${t.hint}\n`)
				console.log('\n')
				throw e
			}
			passed++
		}
	} finally {
		console.log(`Progress: ${passed}/${total}`)
	}
}

tests()
