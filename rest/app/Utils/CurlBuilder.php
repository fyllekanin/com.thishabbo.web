<?php

namespace App\Utils;

class CurlBuilder {

    private $myCurl;

    private $myDefaultHeaders = ['Content-Type: text/html; charset=utf-8'];
    private $myUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'.
    '(KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36';

    const BASIC_AUTH_ADMIN = 'admin';

    private function __construct(string $url) {
        $this->myCurl = curl_init();
        curl_setopt($this->myCurl, CURLOPT_URL, $url);
        curl_setopt($this->myCurl, CURLOPT_HTTPHEADER, $this->myDefaultHeaders);
        curl_setopt($this->myCurl, CURLOPT_USERAGENT, $this->myUserAgent);
        curl_setopt($this->myCurl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($this->myCurl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($this->myCurl, CURLOPT_CONNECTTIMEOUT, 2);
        curl_setopt($this->myCurl, CURLOPT_TIMEOUT, 5);
    }

    /**
     * Set basic authentication on the CURL request
     *
     * @param  string  $username
     * @param  string  $password
     *
     * @return $this
     */
    public function withBasicAuth(string $username, string $password) {
        curl_setopt($this->myCurl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($this->myCurl, CURLOPT_USERPWD, "{$username}:{$password}");
        return $this;
    }

    /**
     * Set headers for the CURL request, will override existing headers
     *
     * @param  array  $headers
     *
     * @return $this
     */
    public function withHeaders(array $headers) {
        curl_setopt($this->myCurl, CURLOPT_HTTPHEADER, $headers);
        return $this;
    }

    /**
     * Set the azuracast api key in headers, this will override
     * existing headers set
     *
     * @param  string  $apiKey
     *
     * @return $this
     */
    public function withAzuracastApiKey(string $apiKey) {
        curl_setopt($this->myCurl, CURLOPT_HTTPHEADER, ["X-API-Key: {$apiKey}"]);
        return $this;
    }

    /**
     * Set method as POST for the request
     *
     * @return $this
     */
    public function asPostMethod() {
        curl_setopt($this->myCurl, CURLOPT_POST, true);
        return $this;
    }

    /**
     * Set body to be sent in the request
     *
     * @param  mixed  $data
     *
     * @return $this
     */
    public function withBody($data) {
        curl_setopt($this->myCurl, CURLOPT_POSTFIELDS, $data);
        return $this;
    }

    /**
     * Set verify for SSL connection
     *
     * @return $this
     */
    public function withSslVerify() {
        curl_setopt($this->myCurl, CURLOPT_SSL_VERIFYHOST, 2);
        curl_setopt($this->myCurl, CURLOPT_SSL_VERIFYPEER, 1);
        return $this;
    }

    /**
     * Execute the CURL and close it
     *
     * @return mixed
     */
    public function exec() {
        $result = curl_exec($this->myCurl);
        curl_close($this->myCurl);
        return $result;
    }

    /**
     * Return new instance of the CurlBuilder
     *
     * @param  string  $url
     *
     * @return CurlBuilder
     */
    public static function newBuilder(string $url) {
        return new CurlBuilder($url);
    }
}
