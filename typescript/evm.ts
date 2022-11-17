/**
 * EVM From Scratch
 * TypeScript template
 *
 * To work on EVM From Scratch in TypeScript:
 *
 * - Install Node.js: https://nodejs.org/en/download/
 * - Go to the `typescript` directory: `cd typescript`
 * - Install dependencies: `yarn` (or `npm install`)
 * - Edit `evm.ts` (this file!), see TODO below
 * - Run `yarn test` (or `npm test`) to run the tests
 * - Use Jest Watch Mode to run tests when files change: `yarn test --watchAll`
 */
const keccak256 = require('keccak256')

export default function evm(code: Uint8Array) {
	let pc = 0
	let stack = []
	let memory = []

	while (pc < code.length) {
		const opcode = code[pc]
		pc++
		switch (opcode) {
			// Stack Input	        Stack Output
			case 0x00:
				// STOP
				break
			case 0x20:
				// SHA3
				// offset  length       hash
				const arg_0x20_offset = stack[code[pc++]]
				const arg_0x20_length = stack[code[pc++]]
				const hash = keccak256(
					memory.slice(arg_0x20_offset, arg_0x20_offset + arg_0x20_length)
				)
				stack.push(hash)
				return
				break

			case 0x33:
				//                      msg.caller
				// CALLER
				break
			case 0x52:
				// 	MSTORE
				// 	offset	value
				const arg_0x52_1 = code[pc++]
				const arg_0x52_2 = code[pc++]
				break
			case 0x60:
				//	PUSH1
				//                      uint8

				break
			case 0xf3:
				// RETURN
				// offset	length
				const arg_0xf3_1 = code[pc++]
				const arg_0xf3_2 = code[pc++]
				break
			default:
				console.log('not found')
		}
	}

	return { success: true, stack }
}
