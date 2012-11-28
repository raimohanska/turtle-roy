package turtleroy

trait IdGenerator {
  def nextId : String
}

class RandomIdGenerator extends IdGenerator {
  def nextId = RandomStrings.randomString(10)
}

object RandomStrings {
  private val random = new scala.util.Random

  def randomString(len : Int) : String = {
    len match {
      case 0 => ""
      case _ => randomChar + randomString(len - 1)
    }
  }
  private def randomChar : Char = {
    val chars = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890"
    chars.charAt(math.abs(random.nextInt()) % chars.length())
  }
}
