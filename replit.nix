{ pkgs }: 
let

    nginxModified = pkgs.nginx.overrideAttrs (oldAttrs: rec {
        configureFlags = oldAttrs.configureFlags ++ [
            "--http-client-body-temp-path=/home/runner/nix-template/cache/client_body"
            "--http-proxy-temp-path=/home/runner/nix-template/cache/proxy"
            "--http-fastcgi-temp-path=/home/runner/nix-template/cache/fastcgi"
            "--http-uwsgi-temp-path=/home/runner/nix-template/cache/uwsgi"
            "--http-scgi-temp-path=/home/runner/nix-template/cache/scgi"
         ];
    });

in {
	deps = [
        pkgs.nodejs-16_x
        pkgs.postgresql
	];

}