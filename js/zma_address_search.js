// グローバル変数として `map` と `mrk_widget` を定義
let map;
let mrk_widget;

// ローダーのメソッド実行
ZMALoader.setOnLoad(function (mapOptions, error) {
  if (error) {
    console.error(error)
    return
  }

  // 地図オブジェクト
//  var map;

  // 中心点の緯度経度(東京駅)
  const lat = 35.681406, lng = 139.767132;

  // マップコンテナ要素を取得する
  const mapElement = document.getElementById('ZMap');

  // MapOptionsをデフォルト値から変更する場合各パラメータに値を設定
  // 中心点の緯度経度を設定
  mapOptions.center = new ZDC.LatLng(lat, lng);
  mapOptions.zipsMapType = 'kP8KjZdn'
  mapOptions.mouseWheelReverseZoom = true; // ★マウスホイールのズーム方向の反転を指定


  // 地図を生成
  map = new ZDC.Map(
    mapElement,
    mapOptions,
    function() {
      // Success callback
      // コントロールを追加する
      // 左上 拡大縮小ボタン表示
      map.addControl(new ZDC.ZoomButton('bottom-right', new ZDC.Point(-20, -35)));
      // 右上 コンパス表示
      map.addControl(new ZDC.Compass('top-right'));
      // 左下 スケールバー表示
      map.addControl(new ZDC.ScaleBar('bottom-left'));

    },
    function() {
      // Failure callback
    }
  );
})

async function searchAddress() {
  const address = document.getElementById("address").value;

  if (!address) {
      alert("住所を入力してください");
      return;
  }

  try {
      const response = await fetch('https://test-web.zmaps-api.com/search/address', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'x-api-key': 'gkZZ5thvD128fdg5OFYGa4nhJCctGemb9FKvZWx3',
              'Authorization': 'referer'
          },
          body: new URLSearchParams({
              word: address,
              word_match_type: '3'
          })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.result.item);

        if (data.status === "OK" && data.result.info.hit > 0) {
            const location = data.result.item[0].position;
              
              // 配列の順序が[経度, 緯度]であることを確認
              const lng = location[0];
              const lat = location[1];

              const latLng = new ZDC.LatLng(lat, lng);

              // 地図をその位置に移動
              map.setCenter(latLng);

              /* Markerの設置 */
              center_mrk =new ZDC.CenterMarker();
              // MarkerをMapに追加
              map.addControl(center_mrk);

              // 検索結果を表示
              document.getElementById("result-address").textContent = data.result.item[0].address;
              document.getElementById("result-address_read").textContent = data.result.item[0].address_read;
              document.getElementById("result-lat").textContent = lat;
              document.getElementById("result-lng").textContent = lng;
              document.getElementById("result").style.display = "block";

              console.log("緯度:", lat, "経度:", lng);
          } else {
              alert("住所の位置情報が見つかりませんでした");
          }
      }  catch (error) {
      console.error("エラーが発生しました:", error);
      alert("住所の検索中にエラーが発生しました");
  }
}