require('net').createServer(function(sock) {
  sock.on('data', function(data) {
    sock.write('HTTP/1.1 200 OK\r\n');
    sock.write('Transfer-Encoding: chunked\r\n');
    sock.write('\r\n'); 
    sock.write('b\r\n');// 11 字节
    sock.write('01234567890\r\n');
    sock.write('5\r\n');// 5 字节
    sock.write('12345\r\n');
    sock.write('4\r\n');// 4 字节
    sock.write('1111\r\n');
    sock.write('0\r\n');
    sock.write('\r\n');
  });
}).listen(9090, '127.0.0.1');