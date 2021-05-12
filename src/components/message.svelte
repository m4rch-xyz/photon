<script>
	export let message
</script>


<div class="{message.type || "info"} main">
	<div class="text">{message.text}</div>
	<div on:click={() => message = null} class="close"></div>
</div>


<style>

	.main {
		position: fixed;
		bottom: 20px;
		left: 120px;
		right: 20px;
		z-index: 40;

		height: 48px;
		padding: 15px 50px;

		box-sizing: border-box;
	}

	.main.info {
		background-color: #0000ff33;
	}

	.main.warn {
		background-color: #ffff0033;
	}

	.main.error {
		background-color: #ff000033;
	}

	.text {
		font-size: 20px;
		text-align: center;
	}

	.close {
		position: absolute;

		bottom: 10px;
		right: 25px;

		width: 30px;
		height: 30px;

		opacity: 0.4;

		cursor: pointer;
	}

	.close:hover {
		opacity: 1;
	}

	.close:before, .close:after {
		position: absolute;

		left: 15px;

		height: 33px;
		width: 2px;

		background-color: #666666;

		content: '';

		transition: 0.4s background-color;
	}

	.close:before {
		transform: rotate(45deg);
	}

	.close:after {
		transform: rotate(-45deg);
	}

</style>
