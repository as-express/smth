FROM rust:1.76 as builder

WORKDIR /app
COPY . .

RUN cargo build --release

FROM debian:bullseye-slim

RUN apt-get update && apt-get install -y ca-certificates && apt-get clean

COPY --from=builder /app/target/release/rust-parser /usr/local/bin/rust-parser

EXPOSE 8000

CMD ["rust-parser"]
