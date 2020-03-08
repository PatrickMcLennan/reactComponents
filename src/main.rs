use std::env::args;
use std::io::*;

struct answer {
    name: String;
}

fn get_answer(message: String) -> () {
    let mut answer = String::new();
    println!("{}", message);
    let _ = stdout().flush();
    stdin()
        .read_line(&mut answer)
        .expect("Please answer with a Y or N");
    if let Some('\n') = answer.chars().next_back() {
        answer.pop();
    }
    if let Some('\r') = answer.chars().next_back() {
        answer.pop();
    }
    println!("{}", answer)
}

fn main() {
    if args().len() != 2 {
        return println!(
            "You must pass only 1 argument into this script -- a valid component name."
        );
    };
    let name: String = args().nth(args().len() - 1).unwrap();
    let _typescript = get_answer(format!("Will {name} be TypeScript?", name = name));
    let _style = get_answer(format!("Will {name} use SCSS?", name = name));
}
