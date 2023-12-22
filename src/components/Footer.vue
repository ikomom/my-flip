<template>
  <div justify-center text-xl flex mt-6 gap-2>
    <button icon-btn @click="toggleDark()">
      <div dark:i-carbon-moon i-carbon-sun />
    </button>
    <a
      icon-btn i-carbon-logo-github
      rel="noreferrer"
      href="https://github.com/ikomom/my-flip"
      target="_blank"
      title="GitHub"
    />
  </div>
</template>
