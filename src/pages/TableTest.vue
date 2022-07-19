<script>

</script>

<template>
  <div class="t-container">
    <div class="virtual-scroll" />
    <table class="t-main">
      <thead class="sticky-top">
        <tr>
          <th class="sticky-left">
            dog
          </th>
          <th>cat</th>
          <th>pig</th>
          <th>fly</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="sticky-left">
            1
          </td>
          <td>3d</td>
          <td>4</td>
          <td rowspan="3">
            hh
          </td>
        </tr>
        <tr>
          <td class="sticky-left">
            2
          </td>
          <td>23</td>
          <td>11</td>
        </tr>
        <tr>
          <td class="sticky-left">
            2
          </td>
          <td>23</td>
          <td>11</td>
        </tr>
        <tr>
          <td class="sticky-left">
            2
          </td>
          <td>23</td>
          <td>11</td>
        </tr>
        <tr>
          <td class="sticky-left">
            2
          </td>
          <td>23</td>
          <td>11</td>
        </tr>
        <tr>
          <td class="sticky-left">
            2
          </td>
          <td>23</td>
          <td>11</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.t-container {
  width: 200px;
  height: 100px;

  position: relative;
  overflow: auto;
  border: 1px solid #000;

  .t-main {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    table-layout: fixed;
    border-collapse: separate;
    border-spacing: 0;

    width: 400px;

    tr:first-child > th {
      border-top: 0;
    }
    th:first-child {

    }

    th, td {
      border: 1px solid #eee;
    }
  }

  @mixin sticky {
    position: sticky;
    z-index: 1;
    background: #ffffff;
  }

  .sticky-left {
    @include sticky;
    border-right: 1px solid #ddd !important;
    left: 0;
  }

  .sticky-top {
    @include sticky;
    border-bottom: 1px solid #ddd !important;
    top: 0;
    z-index: 2;
  }

  .virtual-scroll {

  }
}
</style>
