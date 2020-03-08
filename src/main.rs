use text_io::scan;
use std::env::args;

struct Component {
    typescript: bool ;
    sass: bool;
}

fn get_answer(message: String) -> () {
    let mut answer = String::new();
    println!("{}", message);
    let _ = stdout().flush();
    stdin().read_line(&mut answer).expect("Please answer with a Y or N");
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
        return println!("You must pass only 1 argument into this script -- a valid component name.")
    };
    let name: String = args().nth(args().len() - 1).unwrap();
    assert_eq!(args().len(), 2);
    let typescript = get_answer(format!("Will {name} be TypeScript?", name = name));
}