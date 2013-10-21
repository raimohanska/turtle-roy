package turtleroy.mongodb

import com.mongodb.casbah.{Imports, MongoURI}
import com.mongodb.casbah.commons.{Imports => CommonsImports}
import com.mongodb.casbah.query.{Imports => QueryImports}
import com.mongodb.ServerAddress
import turtleroy.Turtle

trait TurtleStorage {
  def storeTurtle(turtle: Turtle)
  def findTurtle(id: String): Option[Turtle]
  def findTurtle(author: String, name: String): Option[Turtle]
  def findByAuthor(author: String): List[Turtle]
  def turtles: Iterable[Turtle]
}

class MongoStorage extends TurtleStorage with MongoDBSupport {
  def initMongo = {
    val uri = Option.apply(java.lang.System.getenv("MONGOHQ_URL"))
    uri match {
      case Some(uri) => {
        println("Using mongo URI " + uri)
        val mongoURI = MongoURI(uri);
        val db = mongoURI.connectDB;
        db.authenticate(mongoURI.username, new String(mongoURI.password))
        db
      }
      case None => {
        println("Using default mongo uri")
        val server = new ServerAddress("127.0.0.1:27017")
        MongoConnection(server)("turtleroy")
      }
    }

  }
  lazy val mongoDB = initMongo
  protected def turtleCollection = mongoDB("turtle")

  def findTurtle(id: String) = findOne(MongoDBObject("id" -> id))

  def findTurtle(author: String, name: String) = findOne(MongoDBObject("content.author" -> author, "content.description" -> name))

  def findByAuthor(author: String) = findAll(MongoDBObject("content.author" -> author))

  def storeTurtle(turtle: Turtle) = turtleCollection.findAndModify(
    MongoDBObject("id" -> turtle.id), null, null, false, toDBObject(turtle), true, true).map(toObject[Turtle])

  def turtles = findAll(MongoDBObject())

  private def findOne(query: MongoDBObject) = findAll(query).headOption
  private def findAll(query: MongoDBObject) = turtleCollection.find(query).map(toObject[Turtle]).toList.sortBy(_.date).reverse
}

trait MongoDBSupport extends Imports with CommonsImports with QueryImports {
  import com.novus.salat._
  implicit val ctx = new Context {
    val name = "CustomContext"
    override val typeHintStrategy = StringTypeHintStrategy(TypeHintFrequency.WhenNecessary)
  }
  def toObject[A <: CaseClass](dbObject: DBObject)(implicit m: Manifest[A]) = grater[A].asObject(dbObject)
  def toDBObject[A <: CaseClass](a: A)(implicit m: Manifest[A]) = grater[A].asDBObject(a)
}
